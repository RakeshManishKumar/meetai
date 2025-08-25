import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import { meetings, agents } from "@/db/schema";
import { TRPCError } from "@trpc/server";

import { z } from "zod";
import { eq, and, getTableColumns, ilike, desc, sql } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { meetingInsertSchema, meetingUpdateSchema } from "../schema";

export const meetingsRouter = createTRPCRouter({




  update:protectedProcedure
    .input(meetingUpdateSchema)
    .mutation(async ({ input, ctx }) => {
     const [updatedMeeting] = await db.update(meetings).set(input).where(and(eq(meetings.id, input.id), eq(meetings.UserId, ctx.auth.user.id))
    ).returning();
    ;
   if(!updatedMeeting){
    throw new TRPCError({ code: "NOT_FOUND", message: "Meeting not found" });
   }
   return updatedMeeting;
    }),

  remove:protectedProcedure
    .input(z.object({ id: z.string()}))
    .mutation(async ({ input, ctx }) => {
     const [removedMeeting] = await db.delete(meetings).where(and(eq(meetings.id, input.id), eq(meetings.UserId, ctx.auth.user.id))
    ).returning();
    ;
   if(!removedMeeting){
    throw new TRPCError({ code: "NOT_FOUND", message: "Meeting not found" });
   }
   return removedMeeting;
    }),

  
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
        agentId:z.string().nullish(),
        status:z.enum(["Upcoming","active","cancelled","processing","completed"]).nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search, agentId, status } = input;

        

      const data = await db
        .select({
          ...getTableColumns(meetings),
          agent:agents,
          duration:sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration")
        })
        .from(meetings)
        .innerJoin(agents,eq(meetings.agentId,agents.id))
        .where(
          and(
            eq(meetings.UserId, ctx.auth.user.id),
            search ? ilike(meetings.name, `%${search}%`) : undefined,
            status ? eq(meetings.status, status) : undefined,
            agentId ? eq(meetings.agentId, agentId) : undefined
          )
        )
        .orderBy(desc(meetings.createdAt), desc(meetings.name))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [total] = await db
        .select({ count: sql<number>`count(*)` })
        .from(meetings)
        .innerJoin(agents,eq(meetings.agentId,agents.id))
        .where(
          and(
            eq(meetings.UserId, ctx.auth.user.id),
            search ? ilike(meetings.name, `%${search}%`) : undefined,
            status ? eq(meetings.status, status) : undefined,
            agentId ? eq(meetings.agentId, agentId) : undefined
          )
        );

      const totalPages = Math.ceil(total.count / pageSize);

      return {
        items: data,
        total: total.count,
        totalPages,
      };
    }),

  getOne: protectedProcedure
    .input(z.object({ id: z.string().min(1, { message: "ID is required" }) }))
    .query(async ({ input, ctx }) => {
      const [existingMeeting] = await db
        .select({
          ...getTableColumns(meetings),
          agent:agents,
          duration:sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration")
        })
        .from(meetings)
        .innerJoin(agents,eq(meetings.agentId,agents.id))
        .where(and(eq(meetings.id, input.id), eq(meetings.UserId, ctx.auth.user.id)));

      if (!existingMeeting) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Meeting not found" });
      }

      return {
        ...existingMeeting,
      };
    }),
      create: protectedProcedure
        .input(meetingInsertSchema)
        .mutation(async ({ input, ctx }) => {
          const [createdMeeting] = await db
            .insert(meetings)
            .values({
              ...input,
              UserId: ctx.auth.user.id,
            })
            .returning();
    
          return createdMeeting;
        }),
});


