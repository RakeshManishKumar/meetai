"use client";

import { Card, CardContent } from "@/components/ui/card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaGithub, FaGoogle } from "react-icons/fa";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { OctagonAlertIcon } from "lucide-react";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Valid email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const SignInView = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setPending(true);
    setError(null);

    authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
        callbackURL:"/"
      },
      {
        onSuccess: () => {
          setPending(false);
          router.push("/");
        },
        onError: ({ error }) => {
          setError(error.message);
          setPending(false);
        },
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gray-100 gap-4">
      <Card className="overflow-hidden p-0 w-full max-w-5xl shadow-lg border border-green-300">
        <CardContent className="grid p-0 md:grid-cols-2 min-h-[600px]">
          {/* Column 1: Form */}
          <Form {...form}>
            <form
              className="p-8 md:p-12 flex flex-col gap-8"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="flex flex-col items-center text-center">
                <h1 className="text-3xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance text-lg">
                  Login to your account
                </p>
              </div>

              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {!!error && (
                <Alert className="bg-destructive/10 border-none flex items-center gap-2">
                  <OctagonAlertIcon className="h-4 w-4 text-destructive" />
                  <AlertTitle>{error}</AlertTitle>
                </Alert>
              )}

              <Button disabled={pending} type="submit" className="w-full cursor-pointer">
                {pending ? "Signing In..." : "Sign In"}
              </Button>

              <div className="relative text-center text-sm">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <span className="bg-card text-muted-foreground relative px-2 z-10">
                  or continue with
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button 
                
                onClick={() => authClient.signIn.social(
                  {
                    provider: "google",
                    callbackURL:"/"
                  },
                  {
                    onSuccess: () => {
                      setPending(false);
                     
                    },
                    onError: ({ error }) => {
                      setError(error.message);
                      setPending(false);
                    },
                  }
                )}
                variant="outline" type="button" className="w-full cursor-pointer">
                  <FaGoogle/>
                </Button>
                <Button 
                onClick={() => authClient.signIn.social(
                  {
                    provider: "github",
                    callbackURL:"/"
                  },
                  {
                    onSuccess: () => {
                      setPending(false);
                    },
                    onError: ({ error }) => {
                      setError(error.message);
                      setPending(false);
                    },
                  }
                )}

                variant="outline" type="button" className="w-full cursor-pointer">
                  <FaGithub/>
                </Button>
              </div>

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  className="underline underline-offset-4"
                  href="/auth/sign-up"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </Form>

          {/* Column 2: Branding */}
          <div className="bg-gradient-to-bl from-green-700 to-green-900 p-6 relative hidden md:flex flex-col gap-y-4 items-center justify-center">
            <img
              src="/logo.svg"
              alt="Meet.AI Logo"
              className="h-[92px] w-[92px]"
            />
            <p className="text-2xl font-semibold text-white">Meet.AI</p>
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground text-center text-xs text-balance">
        By clicking Sign In, you agree to our{" "}
        <a
          href="#"
          className="hover:text-primary underline underline-offset-4"
        >
          terms of service
        </a>{" "}
        and{" "}
        <a
          href="#"
          className="hover:text-primary underline underline-offset-4"
        >
          privacy policy
        </a>
        .
      </div>
    </div>
  );
};
