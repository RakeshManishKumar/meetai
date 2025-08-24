"use client";

import { ErrorState } from "@/components/errorState";
import { LoadingState } from "@/components/loadingState";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/data-table";
import { columns } from "@/modules/meetings/ui/components/columns";
import { EmptyState } from "@/components/emptyState";

export const MeetingsView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));
  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable columns={columns} data={data.items} />

      {data.items.length === 0 && (
        <EmptyState
          title="Create Your First Meeting"
          description="Create a meeting to join your Agents . Each agent will follow your instructions and help you in your meetings."
        />
      )}
    </div>
  );
};

export const MeetingsViewLoading = () => {
  return (
    <LoadingState
      title="Loading Meetings"
      description="This may take a few seconds..."
    />
  );
};

export const MeetingsViewError = () => {
  return <ErrorState title="Error" description="Something went wrong" />;
};
