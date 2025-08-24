import { meetingInsertSchema } from "@/modules/meetings/schema";


import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {toast} from "sonner"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { MeetinggetOne } from "../../types";
import { useState } from "react";
import {CommandSelect} from "@/components/command-select"
import {GenerateAvatar} from "@/components/generate-avatar"
import { NewAgentDialog } from "@/modules/agents/server/ui/components/new-agent-dialog";

interface MeetingFormProps {
    onSuccess?: (id?:string) => void;
    onCancel: () => void;
    initialValue?: MeetinggetOne;
}       

export const MeetingForm = ({ onSuccess, onCancel, initialValue }: MeetingFormProps) => {


    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [agentSearch,setAgentSearch] = useState("")
    const [openNewAgentDialog ,setOpenNewAgentDialog] = useState(false)
const agents = useQuery(trpc.agents.getMany.queryOptions({
    pageSize:100,
    search:agentSearch
}));

    const createMeeting = useMutation(
      trpc.meetings.create.mutationOptions({
        onSuccess: async (data) => {
          await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
          onSuccess?.(data.id);
        },
        onError: (error) => {
          toast(error.message);
        },
      })
    );
  
    const updateMeeting = useMutation(
      trpc.meetings.update.mutationOptions({
        onSuccess: async (data) => {
          await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
          if (initialValue?.id) {
            await queryClient.invalidateQueries(trpc.meetings.getOne.queryOptions({ id: initialValue.id }));
          }
          onSuccess?.(data.id);
        },
        onError: (error) => {
          toast(error.message);
        },
      })
    );
  
    const form = useForm<z.infer<typeof meetingInsertSchema>>({
      resolver: zodResolver(meetingInsertSchema),
      defaultValues: {
        name: initialValue?.name ?? "",
        agentId: initialValue?.agentId ?? "",
      },
    });
  
    const isEdit = !!initialValue?.id;
    const isPending = createMeeting.isPending || updateMeeting.isPending;
  
    const onSubmit = (values: z.infer<typeof meetingInsertSchema>) => {
      if (isEdit) {
        updateMeeting.mutate({
          ...values,
          id: initialValue?.id ?? "",
        });
      } else {
        createMeeting.mutate(values);
      }
    };
  
    return (
        <>
        <NewAgentDialog open={openNewAgentDialog} onOpenChange={setOpenNewAgentDialog} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Name with avatar */}
          <div className="flex items-center gap-x-4">
          
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter meeting name" />
                  </FormControl>
                  <FormDescription>
                    Give your meeting a descriptive name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
  
          {/* Agent ID */}
          <FormField
            control={form.control}
            name="agentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent ID</FormLabel>
                <FormControl>
                <CommandSelect
                options={(agents.data?.items ?? []).map((agent)=>({
                    value:agent.id,
                    id:agent.id,
                    children:
                    (
                        <div className="flex items-center gap-x-2">
                        <GenerateAvatar
                        seed={agent.name}
                        variant="initials"
                        className="border size-6"
                        />
                        <span>{agent.name}</span>
                        </div>
                    )
                })) ?? []}
                onSelect={field.onChange}
                onSearch={setAgentSearch}
                value={field.value}
                placeholder="Select an agent"
                />
                </FormControl>
                <FormDescription>
             Not found what you&aposs;re looking for? 
             
             <Button
             
             type = "button"
             onClick={()=>setOpenNewAgentDialog(true)}
             variant="link"
             className="text-primary hover:underline"
             >
                Create new agent
                </Button> 
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
  
          {/* Actions */}
          <div className="flex justify-end gap-x-3 pt-2">
            {onCancel && (
              <Button
                variant="outline"
                disabled={isPending}
                type="button"
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isPending}>
              {isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </>
    );
  };
  