"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";

export const HomeView = () => {
  const trpc = useTRPC();
  const {data}  = useQuery(trpc.hello.queryOptions({text: "world"}));
  
 return (
  <div>
{data?.greeting}
</div>
 )
};
