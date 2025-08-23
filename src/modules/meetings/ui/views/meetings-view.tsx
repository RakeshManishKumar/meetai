"use client"

import { ErrorState } from "@/components/errorState";
import { LoadingState } from "@/components/loadingState";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const MeetingsView = () => {
    
    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));
    return (
        <div>
            {JSON.stringify(data)}
        </div>
    )
}


export const MeetingsViewLoading = () => {
    return (
        <LoadingState title="Loading Meetings" description="This may take a few seconds..."/>
    )
}

export const MeetingsViewError = () => {
    return (
        <ErrorState title="Error" description="Something went wrong"/>
    )
}