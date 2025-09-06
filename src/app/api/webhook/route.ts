import {
  CallEndedEvent,
  CallSessionStartedEvent,
  CallSessionParticipantLeftEvent,
  CallTranscriptionReadyEvent,
  CallRecordingReadyEvent,
  StreamClient,
} from "@stream-io/node-sdk";

import { and, eq, not, getTableColumns } from "drizzle-orm";
import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

import { agents, meetings } from "@/db/schema";
import { streamVideoClient } from "@/lib/stream-video";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

function verifySignatureWIthSDK(body: string, signature: string): boolean {
  return streamVideoClient.verifyWebhook(body, signature);
}

export async function POST(req: NextRequest) {
  console.log("Webhook received request");
  const signature = req.headers.get("x-signature");
  const apiKey = req.headers.get("x-api-key");
  console.log("Headers received:", {
    hasSignature: !!signature,
    hasApiKey: !!apiKey,
  });
  if (!signature || !apiKey) {
    return NextResponse.json(
      { error: "missing signature or api key" },
      { status: 400 }
    );
  }

  const body = await req.text();
  if (!verifySignatureWIthSDK(body, signature)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }
  let payLoad: Record<string, unknown>;
  try {
    payLoad = JSON.parse(body) as Record<string, unknown>;
  } catch (e) {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }
  const eventType = (payLoad as Record<string, unknown>)?.type;
  console.log("Processing event type:", eventType);

  if (eventType === "call_session_started") {
    console.log("Call session started event received");
    const event = payLoad as unknown as CallSessionStartedEvent;

    const meetId = event.call.custom?.meetingId;
    if (!meetId) {
      return NextResponse.json(
        { error: "missing meeting id" },
        { status: 400 }
      );
    }

    const [existingMeeting] = await db
      .select()
      .from(meetings)
      .where(
        and(
          eq(meetings.id, meetId),
          not(eq(meetings.status, "completed")),
          not(eq(meetings.status, "active")),
          not(eq(meetings.status, "cancelled")),
          not(eq(meetings.status, "processing"))
        )
      );

    if (!existingMeeting) {
      return NextResponse.json(
        { error: "meeting not found or already completed" },
        { status: 404 }
      );
    }

    await db
      .update(meetings)
      .set({
        status: "active",
        startedAt: new Date(),
      })
      .where(eq(meetings.id, meetId));

    // Get the meeting with agent details
    const [meetingWithAgent] = await db
      .select({
        ...getTableColumns(meetings),
        agent: agents,
      })
      .from(meetings)
      .innerJoin(agents, eq(meetings.agentId, agents.id))
      .where(eq(meetings.id, meetId));

    if (!meetingWithAgent || !meetingWithAgent.agent) {
      console.error("Meeting or agent not found for meeting ID:", meetId);
      return NextResponse.json(
        { error: "meeting or agent not found" },
        { status: 404 }
      );
    }
    
    try {
      const call = streamVideoClient.video.call("default", meetId);
      console.log("Connecting AI agent to call...", { callId: call.id });

      // Connect AI agent using OpenAI
      const realtimeClient = await streamVideoClient.video.connectOpenAi({
        call,
        agentUserId: meetingWithAgent.agent.id,
        openAiApiKey: process.env.OPEN_AI_API_KEY!,
      });

      if (!realtimeClient) {
        throw new Error("Failed to create realtime client");
      }

      await realtimeClient.updateSession({
        instructions: meetingWithAgent.agent.instructions,
      });

      console.log("AI agent session updated with instructions");
    } catch (error) {
      console.error("Error connecting AI agent:", error);
      throw error;
    }

    console.log("Successfully connected agent to call:", {
      meetingId: meetId,
      agentId: meetingWithAgent.agent.id,
    });
  } else if (eventType === "call_participant_joined") {
    console.log("Participant joined event received");
    const event = payLoad as any; // Using any since the type isn't exported
    const meetId = event.call_cid?.split(":")[1];

    if (!meetId) {
      return NextResponse.json(
        { error: "missing meeting id" },
        { status: 400 }
      );
    }

    // Get meeting details to check if it needs an agent
    const [meeting] = await db
      .select()
      .from(meetings)
      .where(and(eq(meetings.id, meetId), eq(meetings.status, "active")));

    if (!meeting) return;

    // Check if agent is already in the call
    const call = streamVideoClient.video.call("default", meetId);
    try {
      const { members } = await call.queryMembers({
        filter_conditions: { role: { $eq: "agent" } },
      });

      console.log("Current call members:", {
        memberCount: members.length,
        hasAgent: members.length > 0,
      });

      if (members.length === 0) {
        // No agent in call, connect one
        console.log("No agent in call, attempting to connect one...");
        const [agent] = await db
          .select()
          .from(agents)
          .where(eq(agents.id, meeting.agentId));

        if (agent) {
          console.log("Found agent, connecting to call with OpenAI...", {
            agentId: agent.id,
          });

          // Connect agent with OpenAI
          const realtimeClient = await streamVideoClient.video.connectOpenAi({
            call,
            agentUserId: agent.id,
            openAiApiKey: process.env.OPEN_AI_API_KEY!,
          });

          if (!realtimeClient) {
            throw new Error("Failed to create realtime client with OpenAI");
          }

          // Update session with agent instructions
          await realtimeClient.updateSession({
            instructions: agent.instructions,
          });

          console.log("AI agent connected to call successfully");
        } else {
          console.error("Agent not found in database");
        }
      }
    } catch (error) {
      console.error("Error in participant joined handler:", error);
      throw error;
    }
  } else if (eventType === "call_session_ended") {
    console.log("Call session ended event received");
    const event = payLoad as any;
    const meetId = event.call_cid?.split(":")[1];

    if (meetId) {
      try {
        await db
          .update(meetings)
          .set({
            status: "completed",
            endedAt: new Date(),
          })
          .where(eq(meetings.id, meetId));
        console.log("Marked meeting as completed:", meetId);
      } catch (error) {
        console.error("Error updating meeting status to completed:", error);
      }
    }
  } else if (eventType === "call_session_participant_left") {
    console.log("Participant left event received");
    const event = payLoad as any;
    const meetId = event.call_cid?.split(":")[1];

    if (!meetId) {
      console.log("No meeting ID found in participant left event");
      return NextResponse.json(
        { error: "missing meeting id" },
        { status: 400 }
      );
    }

    try {
      // Check if this is the last participant leaving
      const call = streamVideoClient.video.call("default", meetId);
      const { members } = await call.queryMembers({});

      console.log("Participants remaining in call:", members.length);

      // If no members left or only the agent remains, end the call
      if (members.length <= 1) {
        console.log("Ending call as no participants remain");
        await call.end();

        // Update meeting status to completed
        await db
          .update(meetings)
          .set({
            status: "completed",
            endedAt: new Date(),
          })
          .where(eq(meetings.id, meetId));
      }
    } catch (error) {
      console.error("Error in participant left handler:", error);
    }
  }
  return NextResponse.json({ message: "success" }, { status: 200 });
}

