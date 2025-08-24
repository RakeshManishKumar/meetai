import { MeetingsView } from "@/modules/meetings/ui/views/meetings-view";
import { HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/trpc/server";
import { trpc } from "@/trpc/server";
import { dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { MeetingsViewError } from "@/modules/meetings/ui/views/meetings-view";
import { MeetingsViewLoading } from "@/modules/meetings/ui/views/meetings-view";
import { MeetingListHeader } from "@/modules/meetings/ui/components/meeting-list-header";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
const page = async () => {


const session = await auth.api.getSession(
    {
         headers:await headers()
    }
  )
  if(!session)
  {
    redirect("/auth/sign-in");
  }

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.meetings.getMany.queryOptions({}));

  return (
    <>
    <MeetingListHeader/>
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<MeetingsViewLoading />}>
        <ErrorBoundary fallback={<MeetingsViewError />}>
          <MeetingsView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
    </>
  );
};

export default page;
