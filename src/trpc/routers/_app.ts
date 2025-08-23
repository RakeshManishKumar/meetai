
import { baseProcedure, createTRPCRouter } from '../init';
import { agentRouter } from '@/modules/agents/server/procedures';
import { agents } from '@/db/schema';
import { meetingsRouter } from '@/modules/meetings/server/procedure';
export const appRouter = createTRPCRouter({
 agents:agentRouter,
 meetings:meetingsRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;