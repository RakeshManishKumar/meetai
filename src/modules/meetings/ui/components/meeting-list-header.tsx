"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon,XCircleIcon } from "lucide-react";
import { NewMeetingDialog } from "./new-meeting-dialog";
import { useState } from "react";
import { MeetingSearchFilter } from "./meeting-search-filter";
import { StatusFilters } from "./status-filters";
import { AgentIdFilter } from "./agent-id-filter";
import { useMeetingsFilter } from "../../hooks/use-meetings-filter";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const MeetingListHeader = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

const [filter,updateFilter] = useMeetingsFilter()

const isFilterApplied = !!filter.search || !!filter.status || !!filter.agentId

const onClearFilter = () => {
    updateFilter({
        status: null,
        search: "",
        agentId: "",
        page: 1,
    })
}

  return (
    <>
    <NewMeetingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <h5 className="text-2xl font-semibold">Meetings</h5>
        <Button className="flex items-center gap-x-2" onClick={()=>setIsDialogOpen(true)}>
          <PlusIcon className="h-4 w-4" />
          Add Meeting
        </Button>
      </div>

      <ScrollArea>
      <div className="flex items-center gap-x-2 p-1">
       <MeetingSearchFilter/>
       <StatusFilters/>
       <AgentIdFilter/>
       {isFilterApplied && (
        <Button variant="outline" onClick={onClearFilter}>
          <XCircleIcon className="h-4 w-4" />
          Clear
        </Button>
       )}
      </div>
      <ScrollBar orientation="horizontal"/>
      </ScrollArea>
    </div>
    </>
  );
};
