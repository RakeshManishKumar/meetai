"use client"

import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { LoadingState } from "@/components/loadingState"
import { ErrorState } from "@/components/errorState"
// import { ResponsiveDialog } from "@/components/responsive-dialog"
import { Button } from "@/components/ui/button"
import { DataTable } from "../components/data-table"
import { columns } from "../components/columns"
import { EmptyState } from "@/components/emptyState"
import { useAgentFilter } from "@/modules/agents/hooks/use-agents-filter"
import { DataPagination } from "../components/data-pagination"
import { useRouter } from "next/navigation"
// import { Payment } from "../components/columns"




export const AgentsView = () => {
    const router = useRouter()
    const [filter, updateFilter] = useAgentFilter();
    const trpc = useTRPC()
    const {data} = useSuspenseQuery(trpc.agents.getMany.queryOptions({...filter}))
     
    return (
        <div className="flex-1 gap-y-4 pb-4 px-4 md:px-8 flex flex-col ">
            <DataTable data={data.items} columns={columns}
            onRowClick={(row) => router.push(`/agents/${row.id}`)}
            />
            <DataPagination
            page = {filter.page}
            totalPages = {data.totalPages}
            onPageChange = {(page) => updateFilter({page})}
            />

            {data.items.length === 0 && (
                <EmptyState
                title="Create Your First Agent"
                description="Create an agent to join your Meetings . Each agent will follow your instructions and help you in your meetings."
                />
            )}
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