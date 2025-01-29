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

interface ExtendedUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function GuideSignin() {
  const [error, setError] = useState("");
  const router = useRouter();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
      role: 'guide'
    });
    if (res?.error) {
      setError(res.error as string);
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
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center">
              Sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && <div className="text-black">{error}</div>}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
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
              Don&apos;t have an account?{" "}
              <Link href="/apply-as-guide" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm text-center text-primary hover:underline"
            >
              Forgot your password?
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
