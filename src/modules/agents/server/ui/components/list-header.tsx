"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { NewAgentDialog } from "./new-agent-dialog";
import { useState } from "react";
import { useAgentFilter } from "@/modules/agents/hooks/use-agents-filter";
import { AgentSearchFilter } from "./agent-search-filter";
import { DEFAULT_PAGE } from "@/constants";

export const AgentsListHeader = () => {
  const [filter, updateFilter] = useAgentFilter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isAnyFilterModified = !!filter.search;
  const onClearFilter = () => {
    updateFilter({ search: "", page: DEFAULT_PAGE });
  };
  return (
    <>
      <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="text-xl font-medium">Agents</h5>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusIcon />
            Add Agent
          </Button>
        </div>
        <div className="flex items-center gap-x-2 p-1">
          <AgentSearchFilter />
          {isAnyFilterModified && (
            <Button variant="outline" size="sm" onClick={onClearFilter}>
              <XCircleIcon />
              Clear
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
