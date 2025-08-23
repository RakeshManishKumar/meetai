"use client"

import { ErrorState } from "@/components/errorState";
import { LoadingState } from "@/components/loadingState";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { AgentIdViewHeader } from "../components/agent-id-view-header";
import { GenerateAvatar } from "@/components/generate-avatar";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAgentFilter } from "@/modules/agents/hooks/use-agents-filter";
import { toast } from "sonner";
import { useConfirmed } from "@/modules/agents/hooks/use-confirmed";
import { useState } from "react";
import { UpdateAgentDialog } from "../components/update-agent-dialog";


interface AgentIDViewProps {
    agentId: string;
}   
export const AgentIDView = ({agentId}:AgentIDViewProps) => {
    const [updateAgentDialogOpen, setUpdateAgentDialogOpen] = useState(false)
    const router = useRouter()
    const queryClient = useQueryClient()
    const trpc = useTRPC()
    const {data} = useSuspenseQuery(trpc.agents.getOne.queryOptions({id:agentId}))


    const removeAgent =  useMutation(
     trpc.agents.remove.mutationOptions({   
        onSuccess: async()=>{
            await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
            router.push("/agents")
        },
        onError:(error)=>{
            toast.error(error.message)
        }
    })
    )

    const [RemoveConfirmDialog, removeConfirm] = useConfirmed(
        "Are you sure?",
        `The followinf action will remove ${data?.meetingCount} meetings associated with this agent`,
      );

    const handleRemoveAgent = async () => {
        const confirmed = await removeConfirm();
        if (confirmed) {
          await removeAgent.mutateAsync({ id: agentId });
        }
      };
    return (
        <>
        <RemoveConfirmDialog/>
        <UpdateAgentDialog
        open={updateAgentDialogOpen}
        onOpenChange={setUpdateAgentDialogOpen}
        initialValue={data}
        />
        <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
          <AgentIdViewHeader
            agentId={agentId}
            agentName={data?.name}
            onEdit={() => {setUpdateAgentDialogOpen(true)}} 
            onRemove={handleRemoveAgent} 
          />
      
          <div className="bg-white rounded-lg border shadow-sm p-6 flex flex-col gap-y-6">
            {/* Top section: Avatar + Name */}
            <div className="flex items-center gap-x-4">
              <GenerateAvatar
                variant="initials"
                seed={data?.name}
                className="size-14 rounded-full"
              />
              <div className="flex flex-col">
                <h2 className="text-2xl font-semibold text-foreground">
                  {data?.name}
                </h2>
                <Badge
                  variant="outline"
                  className="mt-2 w-fit flex items-center gap-x-2 [&>svg]:size-4"
                >
                  <VideoIcon className="text-blue-700" />
                  {data?.meetingCount}{" "}
                  {data?.meetingCount === 1 ? "Meeting" : "Meetings"}
                </Badge>
              </div>
            </div>
      
            {/* Instructions section */}
            <div className="border-t pt-4 flex flex-col gap-y-2">
              <p className="text-lg font-medium text-foreground">Instructions</p>
              <p className="text-neutral-700 leading-relaxed">
                {data?.instructions}
              </p>
            </div>
          </div>
        </div>
        </>
      );
      
}

export const AgentIDViewLoading = () => {
    return (
        <LoadingState title="Loading Agents" description="This may take a few seconds..."/>
    )
}

export const AgentIDViewError = () => {
    return (
        <ErrorState title="Error" description="Something went wrong"/>
    )
}