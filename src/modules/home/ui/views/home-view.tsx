"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const HomeView = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession(); // must be client-compatible

  if (!session) {
    return <p>Loading...</p>;
  }
   

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/auth/sign-in");
  };

  return (
    <div className="flex flex-col p-4 gap-y-4">
      <p>Logged in as {session.user?.name}</p>
      <Button onClick={handleSignOut}>Sign Out</Button>
    </div>
  );
};
