import { AgentsView, AgentsViewError } from "@/modules/agents/server/ui/views/agents-view"
import { getQueryClient ,trpc } from "@/trpc/server";
import { HydrationBoundary } from "@tanstack/react-query";
import { dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import { LoadingState } from "@/components/loadingState";
import { ErrorBoundary } from "react-error-boundary";
import { AgentsViewLoading } from "@/modules/agents/server/ui/views/agents-view";
import { AgentsListHeader } from "@/modules/agents/server/ui/components/list-header";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import type { SearchParams } from "nuqs";
import { localSearchParams } from "@/modules/agents/params";


interface AgentsPageProps {
searchParams : Promise<SearchParams>
}

const Page = async ({searchParams}:AgentsPageProps) => {
   const filter = await localSearchParams(searchParams);
   const session = await auth.api.getSession(
    {
         headers:await headers()
    }
  )
  if(!session)
  {
    redirect("/auth/sign-in");
  }

    const queryClient = await getQueryClient();
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions({...filter}))    
    
    return (
        <>
        <AgentsListHeader/>
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<AgentsViewLoading />}>
               <ErrorBoundary fallback={<AgentsViewError />}>
                <AgentsView />
               </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
        </>
    )
}

// export const AgentsViewLoading = () => {
//     return (
//         <LoadingState title="Loading Agents" description="This may take a few seconds..." />
//     )
// }

export default Page;
