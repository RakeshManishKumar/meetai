import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/trpc/routers/_app";


export type MeetinggetOne = inferRouterOutputs<AppRouter>["meetings"]["getOne"]