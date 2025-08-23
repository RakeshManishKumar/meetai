import { agentInsertSchema } from "@/modules/agents/schemas";
import { AgentgetOne } from "@/modules/agents/types";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {GenerateAvatar} from "@/components/generate-avatar";
import { Textarea } from "@/components/ui/textarea";
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


interface AgentFormProps {
    onSuccess: () => void;
    onCancel: () => void;
    initialValue?: AgentgetOne;
}

export const AgentForm = ({onSuccess,onCancel,initialValue}:AgentFormProps) => {
const trpc = useTRPC();
const router = useRouter();
const queryClient = useQueryClient();

const createAgent = useMutation(
    trpc.agents.create.mutationOptions({
            onSuccess: async()=>{
               await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}))
                
                onSuccess?.()
            },
            onError:(error)=>{
                toast(error.message)
            }
            
        })
    )



    const updateAgent = useMutation(
        trpc.agents.update.mutationOptions({
                onSuccess: async()=>{
                   await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}))
                    if(initialValue?.id){
                        await queryClient.invalidateQueries(trpc.agents.getOne.queryOptions({id:initialValue.id}))
                    }
                    onSuccess?.()
                },
                onError:(error)=>{
                    toast(error.message)
                }
                
            })
        )
    


    const form = useForm<z.infer<typeof agentInsertSchema>>({
       resolver:zodResolver(agentInsertSchema),
       defaultValues:{
        name: initialValue?.name ?? "",
        instructions: initialValue?.instructions ?? ""
       }
    })
    const isEdit = !!initialValue?.id;
    const isPending = createAgent.isPending || updateAgent.isPending ;
    const onSubmit = (values:z.infer<typeof agentInsertSchema>)=>{
        if(isEdit){
           updateAgent.mutate({
            ...values,
            id: initialValue?.id ?? ""
           })
        }else{
            createAgent.mutate(values)
        }
    }
    return (
        <Form {...form}>
            <form 
            className="space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}>
                <GenerateAvatar
                seed={form.watch("name")}
                variant="botttsNeutral"
                className="border size-16"
                />
                <FormField
                control={form.control}
                name="name"
                render={({field})=>(
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="Enter agent name"/>
                        </FormControl>
                        <FormDescription>
                            Name of the agent
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>
                )}
                />

<FormField
                control={form.control}
                name="instructions"
                render={({field})=>(
                    <FormItem>
                        <FormLabel>Instructions</FormLabel>
                        <FormControl>
                            <Textarea {...field} placeholder="Enter agent instructions"/>
                        </FormControl>
                        <FormMessage/>
                        <FormDescription>
                            Name of the agent
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>
                )}
                />
             <div className="flex justify-between gap-x-2">
                {onCancel && (
                    <Button
                    variant="ghost"
                    disabled={isPending}
                    type="button"
                    onClick={onCancel}
                    >
                        Cancel
                    </Button>
                )}
                <Button
                type="submit"
                disabled={isPending}
                >
                    {isEdit ? "Update" : "Create"}
                </Button>
             </div>
            </form>
        </Form>
    )
}