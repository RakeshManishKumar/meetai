import {
    CircleXIcon,
    CircleCheckIcon,
    ClockArrowUpIcon,
    ClockFadingIcon,
    VideoIcon,
    LoaderIcon
} from "lucide-react"

import { CommandSelect } from "@/components/command-select"

import { MeetingStatus } from "@/modules/meetings/types"
import { useMeetingsFilter } from "@/modules/meetings/hooks/use-meetings-filter"

const options = [
    {
    id:MeetingStatus.Upcoming,
    value:MeetingStatus.Upcoming,
    children : (
        <div className="flex items-center gap-x-2 capitalize">
        <ClockArrowUpIcon className="h-4 w-4" />
        <span>{MeetingStatus.Upcoming}</span>
        </div>
    )
    },

    {
        id:MeetingStatus.completed,
        value:MeetingStatus.completed,
        children : (
            <div className="flex items-center gap-x-2 capitalize">
            <CircleCheckIcon className="h-4 w-4" />
            <span>{MeetingStatus.completed}</span>
            </div>
        )
        },

        {
            id:MeetingStatus.active,
            value:MeetingStatus.active,
            children : (
                <div className="flex items-center gap-x-2 capitalize">
                <VideoIcon className="h-4 w-4" />
                <span>{MeetingStatus.active}</span>
                </div>
            )
            },

            {
                id:MeetingStatus.processing,
                value:MeetingStatus.processing,
                children : (
                    <div className="flex items-center gap-x-2 capitalize">
                    <LoaderIcon className="h-4 w-4" />
                    <span>{MeetingStatus.processing}</span>
                    </div>
                )
                },
                {
                    id:MeetingStatus.cancelled,
                    value:MeetingStatus.cancelled,
                    children : (
                        <div className="flex items-center gap-x-2 capitalize">
                        <CircleXIcon className="h-4 w-4" />
                        <span>{MeetingStatus.cancelled}</span>
                        </div>
                    )
                    },
        
]

export const StatusFilters = () => {
    const [filter,updateFilter] = useMeetingsFilter()
    return (
        <CommandSelect
        options={options}
        onSelect={(value) => updateFilter({status : value as MeetingStatus})}
        onSearch={(value) => updateFilter({search : value})}
        value={filter.status ?? ""}
        placeholder="Select a status"
        className="h-9"
        />
    )
}
