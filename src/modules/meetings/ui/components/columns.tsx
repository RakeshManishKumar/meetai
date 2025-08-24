"use client";

import { ColumnDef } from "@tanstack/react-table";
import { GenerateAvatar } from "@/components/generate-avatar";
import { Badge } from "@/components/ui/badge";
import {
  CornerDownRightIcon,
  ClockArrowUpIcon,
  CircleCheckIcon,
  CircleXIcon,
  ClockFadingIcon,
  LoaderIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MeetinggetMany } from "@/modules/meetings/types";
import { format } from "date-fns";
import humanizeDuration from "humanize-duration";

function formatDuration(seconds: number) {
  return humanizeDuration(seconds * 1000, {
    language: "en",
    round: true,
    largest: 1,
    units: ["h", "m", "s"],
  });
}

const statusIconMap = {
  Upcoming: ClockArrowUpIcon,
  active: LoaderIcon,
  cancelled: CircleXIcon,
  processing: LoaderIcon,
  completed: CircleCheckIcon,
};

const statusColorMap = {
  Upcoming: "bg-yellow-500/20 text-yellow-800 border-yellow-800/5",
  active: "bg-blue-500/20 text-blue-800 border-blue-800/5",
  cancelled: "bg-rose-500/20 text-rose-800 border-rose-800/5",
  processing: "bg-gray-500/20 text-gray-800 border-gray-800/5",
  completed: "bg-emerald-500/20 text-emerald-800 border-emerald-800/5",
};

export const columns: ColumnDef<MeetinggetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Meeting name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-1">
        <span className="font-semibold capitalize">{row.original.name}</span>

        <div className="flex items-center gap-x-2">
          <div className="flex items-center gap-x-2">
            <CornerDownRightIcon className="size-3 text-muted-foreground" />
            <span className="text-sm text-muted-foreground max-w-[250px] truncate capitalize">
              {row.original.agent.name}
            </span>
          </div>

          <GenerateAvatar
            seed={row.original.agent.name}
            variant="botttsNeutral"
            className="size-4"
          />

          <span className="text-sm text-muted-foreground max-w-[250px] truncate capitalize">
            {row.original.startedAt
              ? format(row.original.startedAt, "dd/MM/yyyy")
              : ""}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const Icon =
        statusIconMap[row.original.status as keyof typeof statusIconMap];

      return (
        <Badge
          variant="outline"
          className={cn(
            "flex capitalize items-center gap-x-2 [&>svg]:size-4 text-muted-foreground",
            statusColorMap[row.original.status as keyof typeof statusColorMap]
          )}
        >
          {Icon && (
            <Icon
              className={cn(
                row.original.status === "processing" && "animate-spin"
              )}
            />
          )}
          {row.original.status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="flex capitalize items-center gap-x-2 [&>svg]:size-4 text-muted-foreground"
      >
        <ClockFadingIcon className="text-blue-700" />
        {row.original.duration
          ? formatDuration(row.original.duration)
          : "No duration"}
      </Badge>
    ),
  },
];
