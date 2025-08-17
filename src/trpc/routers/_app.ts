
import { baseProcedure, createTRPCRouter } from '../init';
import { agentRouter } from '@/modules/agents/server/procedures';
import { agents } from '@/db/schema';

export const appRouter = createTRPCRouter({
 agents:agentRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;