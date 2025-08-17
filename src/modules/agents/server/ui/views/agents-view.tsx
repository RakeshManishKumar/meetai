"use client"

import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { LoadingState } from "@/components/loadingState"
import { ErrorState } from "@/components/errorState"
// import { ResponsiveDialog } from "@/components/responsive-dialog"
import { Button } from "@/components/ui/button"


export const AgentsView = () => {
    const trpc = useTRPC()
    const {data} = useSuspenseQuery(trpc.agents.getMany.queryOptions())
    
    return (
        <div>
            {/* <ResponsiveDialog
            title="Responsive test"
            description="Responsive test"
            open={true}
            onOpenChange={() => {}}
            >
               <Button>
                Some actions
               </Button>
            </ResponsiveDialog> */}
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