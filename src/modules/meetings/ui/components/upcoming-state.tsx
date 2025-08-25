import { EmptyState } from "@/components/emptyState";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {VideoIcon,BanIcon} from "lucide-react"


interface UpcomingStateProps {
    meetingId: string;
    onCancelMeeting: () => void;
    isCancelMeetingLoading: boolean;
}

export const UpcomingState = ({meetingId,onCancelMeeting,isCancelMeetingLoading}:UpcomingStateProps) => {
    return (
        <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
            <EmptyState title="Not stated yet" description="Once you start this meeting, the Summary will appear here." image="/Upcoming.svg"/>
            <div  className="flex flex-col reverse lg:flex-row lg:justify-center items-center gap-2">
               
                <Button variant="secondary" className="w-full lg:w-auto"
                onClick={onCancelMeeting}
                disabled={isCancelMeetingLoading}
                >
                    <BanIcon className="size-4"/>
                    Cancel Meeting
                </Button>

                <Button asChild className="w-full lg:w-auto"
                  disabled={isCancelMeetingLoading}
                >
                    <Link href={`/call/${meetingId}`}>
                    <VideoIcon className="size-4"/>
                    Start Meeting
                    </Link>
                </Button>
            </div>
        </div>
    );
};