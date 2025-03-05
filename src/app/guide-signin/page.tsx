"use client";
import { FormEvent, useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Leaf } from "lucide-react";
import React from "react";
import { ExtendedUser } from "@/lib/auth";

export default function GuideSignin() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      role: "guide",
      callbackUrl: "/guide", // Specify callback URL for guide role
    });

    if (res?.error) {
      setError(res.error);
    }
    if (res?.ok) {
      const session = await getSession();
      const user = session?.user as ExtendedUser;
      return router.push(`/guide/${user.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex flex-col justify-center items-center p-4">
      <Link
        href="/"
        className="text-2xl font-bold text-primary flex items-center mb-8"
      >
        <Leaf className="mr-2 h-6 w-6" />
        OrginTrace
      </Link>
      <Card className="w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl text-center text-primary">
              Guide Sign In
            </CardTitle>
            <CardDescription className="text-center">
              Login as a Guide to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && <div className="text-destructive text-center">{error}</div>}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your guide email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full bg-primary hover:bg-secondary text-white">
              Sign In
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Not a guide?{" "}
              <Link href="/login" className="text-primary hover:underline">
                User Sign in
              </Link>
            </div>
            <div className="text-sm text-center text-muted-foreground">
              Want to become a guide?{" "}
              <Link href="/apply-as-guide" className="text-primary hover:underline">
                Apply here
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
