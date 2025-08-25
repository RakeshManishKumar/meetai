import { EmptyState } from "@/components/emptyState";
import { Button } from "@/components/ui/button";
import { VideoIcon } from "lucide-react";
import Link from "next/link";

interface ActiveStateProps {
    meetingId: string;
}

export const ActiveState = ({meetingId}:ActiveStateProps) => {
    return (
        <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
            <EmptyState title="Meeting is Active" description="Meeting will end once all participants have left" image="/Upcoming.svg"/>
            <div  className="flex flex-col reverse lg:flex-row lg:justify-center items-center gap-2">
                <Button asChild className="w-full lg:w-auto"
                >
                    <Link href={`/call/${meetingId}`}>
                    <VideoIcon className="size-4"/>
                     Join Meeting
                    </Link>
                </Button>
            </div>
        </div>
    );
};