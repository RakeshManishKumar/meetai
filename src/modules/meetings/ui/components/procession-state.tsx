import { EmptyState } from "@/components/emptyState";



export const ProcessingState = () => {
    return (
        <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
            <EmptyState title="Meeting Processing" description="This meeting is completed , a summary will appear soon" image="/processing.svg"/>
        </div>
    );
};