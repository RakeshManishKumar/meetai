"use client"

import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { LoadingState } from "@/components/loadingState"
import { ErrorState } from "@/components/errorState"
export const AgentsView = () => {
    const trpc = useTRPC()
    const {data} = useSuspenseQuery(trpc.agents.getMany.queryOptions())
    
    return (
        <div>
            {JSON.stringify(data,null,2)}
        </div>
    )   ;
};


export const AgentsViewLoading = () => {
    return (
        <LoadingState title="Loading Agents" description="This may take a few seconds..."/>
    )
}

export const AgentsViewError = () => {
    return (
        <ErrorState title="Error" description="Something went wrong"/>
    )
}