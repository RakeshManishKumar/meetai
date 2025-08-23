import { getQueryClient ,trpc} from "@/trpc/server";
import { HydrationBoundary } from "@tanstack/react-query";
import { dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { AgentIDView, AgentIDViewError, AgentIDViewLoading } from "@/modules/agents/server/ui/views/agent-id-view";

interface props {
    params:Promise<{agentId:string}>

} 
const Page = async ({params}:props) => {
    const agentId = await params;
    const queryClient = await getQueryClient();
    void queryClient.prefetchQuery(trpc.agents.getOne.queryOptions({id:agentId.agentId}))
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<AgentIDViewLoading />}>
                 <ErrorBoundary fallback={<AgentIDViewError />}>
                 <AgentIDView agentId={agentId.agentId} />
                 </ErrorBoundary>
           </Suspense>
        </HydrationBoundary>
         )
        }
        export default Page;