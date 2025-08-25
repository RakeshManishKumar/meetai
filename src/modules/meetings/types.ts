import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/trpc/routers/_app";


export type MeetinggetMany = inferRouterOutputs<AppRouter>["meetings"]["getMany"]["items"]

export type MeetinggetOne = inferRouterOutputs<AppRouter>["meetings"]["getOne"]
export enum MeetingStatus {
    Upcoming = "Upcoming",
    active = "active",
    cancelled = "cancelled",
    processing = "processing",
    completed = "completed",
}