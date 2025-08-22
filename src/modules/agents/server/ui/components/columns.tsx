"use client"

import { ColumnDef } from "@tanstack/react-table"
import { AgentgetOne } from "@/modules/agents/types"
import { GenerateAvatar } from "@/components/generate-avatar"
import { Corner } from "@radix-ui/react-scroll-area"
import { Badge } from "@/components/ui/badge"
import { CornerDownRightIcon, VideoIcon } from "lucide-react"


export const columns: ColumnDef<AgentgetOne>[] = [
  {
    accessorKey: "name",
    header: "Agent name",
    cell: ({row}) => {
      return (
        <div className="flex flex-col gap-y-1">
          <div className="flex items-center gap-x-2">
            <GenerateAvatar
            seed={row.original.name}
            variant="botttsNeutral"
            className="size-6"
            />
            <span className="font-semibold capitalize">{row.original.name}</span>
          </div>
          <div className="flex items-center gap-x-2">
<div className="flex items-center gap-x-2">
<CornerDownRightIcon className="size-3 text-muted-foreground"/>
<span className="text-sm text-muted-foreground max-w-[250px] truncate capitalize">
{row.original.instructions}
</span>
</div>
          </div>
        </div>
      )
    }
  },
  {
    accessorKey: "meetingCount",
    header: "Meetings",
    cell: ({row}) => {
      return (
      <Badge variant="outline" className="flex items-center gap-x-2 [&>svg]:size-4">

        <VideoIcon className="text-blue-700"/>
        {row.original.meetingCount}{row.original.meetingCount === 1 ? " Meeting" : " Meetings"}
      </Badge>
      )
    }
  }
]