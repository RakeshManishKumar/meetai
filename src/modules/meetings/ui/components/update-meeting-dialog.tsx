"use client"
import {ResponsiveDialog} from "@/components/responsive-dialog"
import { MeetingForm } from "./meeting-form";
import { useRouter } from "next/navigation";
import { id } from "date-fns/locale";
import { MeetinggetOne } from "../../types";


interface UpdateMeetingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialValues: MeetinggetOne;
}

export const UpdateMeetingDialog = ({
    open,
    onOpenChange,
    initialValues
}: UpdateMeetingDialogProps) => {
        const router = useRouter();
    return (
        <ResponsiveDialog
            title="Update Meeting"
            description="Update a meeting details"
            open={open}
            onOpenChange={onOpenChange}
        >               
        <MeetingForm
        initialValue={initialValues}
        onSuccess={()=>{
            onOpenChange(false)
        }}
        onCancel={()=>{
            onOpenChange(false)
        }}

        />
        </ResponsiveDialog>
    )
}