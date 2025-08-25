import {useState} from "react"
import {useQuery} from "@tanstack/react-query"
import {useTRPC} from "@/trpc/client"
import {CommandSelect} from "@/components/command-select"
import {GenerateAvatar} from "@/components/generate-avatar"
import {NewAgentDialog} from "@/modules/agents/server/ui/components/new-agent-dialog"
import {MeetinggetOne} from "@/modules/meetings/types"
import {useMeetingsFilter} from "@/modules/meetings/hooks/use-meetings-filter"
import {trpc} from "@/trpc/server"

export const AgentIdFilter = () => {
    const [filter,updateFilter] = useMeetingsFilter()
    const trpc = useTRPC()
    const [agentSearch,setAgentSearch] = useState("")
   const {data}= useQuery(trpc.agents.getMany.queryOptions({
    pageSize:100,
    search:agentSearch
   }))
   return (
    <CommandSelect
    options={(data?.items ?? []).map((agent)=>({
        value:agent.id,
        id:agent.id,
        children:
        (
            <div className="flex items-center gap-x-2">
            <GenerateAvatar
            seed={agent.name}
            variant="initials"
            className=" size-4"
            />
            <span>{agent.name}</span>
            </div>
        )
    })) ?? []}
    onSelect={(value) => updateFilter({agentId : value})}
    onSearch={setAgentSearch}
    value={filter.agentId}
    placeholder="Select an agent"
    className="h-9"
    />
   )
}