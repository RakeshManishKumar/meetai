import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { TRPCError } from "@trpc/server";
import { agentInsertSchema, agentUpdateSchema } from "../schemas";
import { z } from "zod";
import { eq, and, getTableColumns, ilike, desc, sql } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";

export const agentRouter = createTRPCRouter({

  update:protectedProcedure
    .input(agentUpdateSchema)
    .mutation(async ({ input, ctx }) => {
     const [updatedAgent] = await db.update(agents).set(input).where(and(eq(agents.id, input.id), eq(agents.userId, ctx.auth.user.id))
    ).returning();
    ;
   if(!updatedAgent){
    throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
   }
   return updatedAgent;
    }),

  remove:protectedProcedure
    .input(z.object({ id: z.string()}))
    .mutation(async ({ input, ctx }) => {
     const [removedAgent] = await db.delete(agents).where(and(eq(agents.id, input.id), eq(agents.userId, ctx.auth.user.id))
    ).returning();
    ;
   if(!removedAgent){
    throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
   }
   return removedAgent;
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;

      const data = await db
        .select({
          ...getTableColumns(agents),
          meetingCount: sql<number>`5`,
        })
        .from(agents)
        .where(
          and(
            eq(agents.userId, ctx.auth.user.id),
            search ? ilike(agents.name, `%${search}%`) : undefined
          )
        )
        .orderBy(desc(agents.createdAt), desc(agents.name))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [total] = await db
        .select({ count: sql<number>`count(*)` })
        .from(agents)
        .where(
          and(
            eq(agents.userId, ctx.auth.user.id),
            search ? ilike(agents.name, `%${search}%`) : undefined
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
      const [agentData] = await db
        .select({
          ...getTableColumns(agents),
        })
        .from(agents)
        .where(and(eq(agents.id, input.id), eq(agents.userId, ctx.auth.user.id)));

      if (!agentData) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
      }

      return {
        ...agentData,
        meetingCount: 5, // Default to 5 since meetings table doesn't exist yet
      };
    }),

  create: protectedProcedure
    .input(agentInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdAgent] = await db
        .insert(agents)
        .values({
          ...input,
          userId: ctx.auth.user.id,
        })
        .returning();

      return createdAgent;
    }),
});
