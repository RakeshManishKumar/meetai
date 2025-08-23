"use client"
import {ResponsiveDialog} from "@/components/responsive-dialog"
import {AgentForm} from "./agent-form"
import { AgentgetOne } from "@/modules/agents/types"

interface UpdateAgentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialValue: AgentgetOne;
}

export const UpdateAgentDialog = ({
    open,
    onOpenChange,
    initialValue
}: UpdateAgentDialogProps) => {
    return (
        <ResponsiveDialog
            title="Update Agent"
            description="Update an existing agent"
            open={open}
            onOpenChange={onOpenChange}
        >
        <AgentForm
        onSuccess={()=>{
            onOpenChange(false)
        }}
        onCancel={()=>{
            onOpenChange(false)
        }}
        initialValue={initialValue}
        />
        </ResponsiveDialog>
    )
}