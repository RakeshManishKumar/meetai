"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { NewMeetingDialog } from "./new-meeting-dialog";
import { useState } from "react";

export const MeetingListHeader = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <>
    <NewMeetingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <h5 className="text-2xl font-semibold">Meetings</h5>
        <Button className="flex items-center gap-x-2" onClick={()=>setIsDialogOpen(true)}>
          <PlusIcon className="h-4 w-4" />
          Add Meeting
        </Button>
      </div>
      <div className="flex items-center gap-x-2 p-1">
        {/* TODO: add filters/search/sort here */}
      </div>
    </div>
    </>
  );
};
