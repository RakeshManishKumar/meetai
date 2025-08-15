"use client"; // 👈 This must be the first line

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { se } from "date-fns/locale";





export default function Home() {
  const {data : session} = authClient.useSession()
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async () => {
    try {
      const res = await authClient.signUp.email({
        email,
        password,
        name,
      });

      console.log(res);
      window.alert("Account created successfully");
    } catch (error: any) {
      console.error(error);
      window.alert(error?.message || "Account creation failed");
    }
  };

  const onLogin = async () => {
    try {
      const res = await authClient.signIn.email({
        email,
        password,
     
      });

      console.log(res);
      window.alert("Account created successfully");
    } catch (error: any) {
      console.error(error);
      window.alert(error?.message || "Account creation failed");
    }
  };
 
  if(session)
  {
    return <div className="flex flex-col p-4 gaap-y-4">
      <p>Logged in as {session.user.name}</p>
      <Button onClick={() => authClient.signOut()}>Sign Out</Button>
    </div>
  }
  return (
    <div className="flex flex-col p-4 gap-y-10">
         <div className="flex flex-col p-4 gap-y-4">
      <Input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={onSubmit}>Create Account</Button>
    </div>

    <div className="flex flex-col p-4 gap-y-4">
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={onLogin}>Login</Button>
    </div>
    </div>
  );
}
