import { AgentsView, AgentsViewError } from "@/modules/agents/server/ui/views/agents-view"
import { getQueryClient ,trpc } from "@/trpc/server";
import { HydrationBoundary } from "@tanstack/react-query";
import { dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import { LoadingState } from "@/components/loadingState";
import { ErrorBoundary } from "react-error-boundary";
import { AgentsViewLoading } from "@/modules/agents/server/ui/views/agents-view";

const Page = async () => {
    const queryClient = await getQueryClient();
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions())    
    
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<AgentsViewLoading />}>
               <ErrorBoundary fallback={<AgentsViewError />}>
                <AgentsView />
               </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    )
}

// export const AgentsViewLoading = () => {
//     return (
//         <LoadingState title="Loading Agents" description="This may take a few seconds..." />
//     )
// }

export default Page;
