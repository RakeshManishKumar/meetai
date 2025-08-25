"use client"
import {
  Call,
  StreamVideo,
  StreamCall,
  StreamVideoClient,
  CallingState,
} from "@stream-io/video-react-sdk";

import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTRPC } from "@/trpc/client";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useMutation } from "@tanstack/react-query";
import { CallUI } from "./call-ui";

interface CallConnectProps {
  meetingId: string;
  meetingName: string;
  userId: string;
  userName: string;
  userImage: string;
}

export const CallConnect = ({
  meetingId,
  meetingName,
  userId,
  userName,
  userImage,
}: CallConnectProps) => {
  const trpc = useTRPC();
  const { mutateAsync: generateTokn } = useMutation(
    trpc.meetings.generateToekn.mutationOptions(),
  );

  const [client, setClient] = useState<StreamVideoClient>();

  useEffect(() => {
    const _client = new StreamVideoClient({
      apiKey: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
      user: {
        id: userId,
        name: userName,
        image: userImage,
      },
      tokenProvider: async () => {
        try {
          const token = await generateTokn();
          return token as string;
        } catch (error) {
          console.error('Failed to generate token:', error);
          throw error;
        }
      },
    });

    setClient(_client);

    return () => {
      _client?.disconnectUser();
      setClient(undefined);
    };
  }, [userId, userName, userImage, generateTokn]);

  const [call, setCall] = useState<Call>();

  useEffect(() => {
    if (!client) return;

    const _call = client.call("default", meetingId);
    _call.camera.disable();
    _call.microphone.disable();
    setCall(_call);

    return () => {
      try {
        if (_call && _call.state?.callingState && _call.state.callingState !== CallingState.LEFT) {
          _call.leave().catch(console.error);
          _call.endCall().catch(console.error);
        }
      } catch (error) {
        console.error('Error during call cleanup:', error);
      } finally {
        setCall(undefined);
      }
    };
  }, [client, meetingId]);

  if (!client || !call) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-sidebar-accent to-sidebar">
        <LoaderIcon className="size-6 animate-spin text-white" />
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallUI meetingName={meetingName} />
      </StreamCall>
    </StreamVideo>
  );
};
