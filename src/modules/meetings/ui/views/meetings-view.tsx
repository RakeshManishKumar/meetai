"use client";

import { ErrorState } from "@/components/errorState";
import { LoadingState } from "@/components/loadingState";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/data-table";
import { columns } from "@/modules/meetings/ui/components/columns";
import { EmptyState } from "@/components/emptyState";
import { useRouter } from "next/navigation";
import { useMeetingsFilter } from "../../hooks/use-meetings-filter";
import { DataPagination } from "../components/data-pagination";

export const MeetingsView = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const [filter,updateFilter] = useMeetingsFilter()
  const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({
    ...filter,
  }));
  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable columns={columns} data={data.items} 
      onRowClick={(row) => router.push(`/meetings/${row.id}`)}
      />
      <DataPagination page={filter.page} totalPages={data.totalPages} onPageChange={(page) => updateFilter({page})} />
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
