import { SearchIcon} from "lucide-react"
import { Input } from "@/components/ui/input" 
import {useAgentFilter} from "@/modules/agents/hooks/use-agents-filter"

export const AgentSearchFilter = () => {
    const [filter,updateFilter] = useAgentFilter()
    return (
        <div className="relative">
            <Input
            className="h-9 bg-white w-[200px] pl-7"
            placeholder="Search agents..."
            value={filter.search}
            onChange={(e) => updateFilter({search: e.target.value})}
            />
            <SearchIcon  className="absolute  size-4 left-2 top-1/2 -translate-y-1/2 text-muted-foreground"/>
        </div>
    )
}
