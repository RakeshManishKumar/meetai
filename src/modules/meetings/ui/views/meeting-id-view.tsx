"use client"
import { ErrorState } from "@/components/errorState";
import { LoadingState } from "@/components/loadingState";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { MeetingIdViewHeader } from "../components/meeting-id-view-header";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useConfirmed } from "../../hooks/use-confirmed";
import { UpdateMeetingDialog } from "../components/update-meeting-dialog";
import { useState } from "react";
import { UpcomingState } from "../components/upcoming-state";
import { ActiveState } from "../components/active-sate";
import { CancelState } from "../components/cancel-state";
import { ProcessingState } from "../components/procession-state";

interface MeetingIdViewProps {
  meetingId: string;
}

export const MeetingIdView = ({ meetingId }: MeetingIdViewProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  );

  const [updateMeetingDialogOpen, setUpdateMeetingDialogOpen] = useState(false);

  const [RemoveConfirmDialog, confirmRemove] = useConfirmed(
    "Are you sure you want to remove this meeting?",
    "Remove Meeting"
  );

  // ✅ useMutation inside the component
  const removeMeeting = useMutation(
    trpc.meetings.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({})
        );
        router.push("/meetings");
      },
      onError: (error) => {
        toast(error.message);
      },
    })
  );

  const handleRemoveMeeting = async () => {
    const ok = await confirmRemove();
    if (!ok) return;
    await removeMeeting.mutateAsync({ id: meetingId });
  };

const isActive = data?.status === "active";
const isProcessing = data?.status === "processing";
const isCancelled = data?.status === "cancelled";
const isCompleted = data?.status === "completed";
const isUpcoming = data?.status === "Upcoming";

  return (
    <>
      <RemoveConfirmDialog />
      <UpdateMeetingDialog
      open={updateMeetingDialogOpen}
      onOpenChange={setUpdateMeetingDialogOpen}
      initialValues={data}
      />
      <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <MeetingIdViewHeader
          meetingId={meetingId}
          meetingName={data?.name ?? ""}
          onEdit={()=>setUpdateMeetingDialogOpen(true)}
          onRemove={handleRemoveMeeting}
        />
        {isCancelled && <CancelState />}
        {isCompleted && <div>Meeting Completed</div>}
        {isProcessing && <ProcessingState />}
        {isUpcoming && <UpcomingState meetingId={meetingId} onCancelMeeting={()=>{}} isCancelMeetingLoading={false} />}
        {isActive && <ActiveState meetingId={meetingId} />}
      </div>
    </>
  );
};

export const MeetingIdViewLoading = () => {
  return (
    <LoadingState
      title="Loading Meeting"
      description="This may take a few seconds..."
    />
  );
};

export const MeetingIdViewError = () => {
  return <ErrorState title="Error" description="Something went wrong" />;
};
