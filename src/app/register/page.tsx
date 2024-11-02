"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/actions/register";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf } from 'lucide-react'


export default function Register() {
    const [error, setError] = useState<string>();
    const router = useRouter();
    const ref = useRef<HTMLFormElement>(null);
    const handleSubmit = async (formData: FormData) => {
        const r = await register({
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            name: formData.get("name") as string
        });
        ref.current?.reset();
        if (r?.error) {
            setError(r.error);
            return;
        } else {
            return router.push("/login");
        }
    };
    return (
        <div className="min-h-screen bg-secondary flex flex-col justify-center items-center p-4">
            <Link href="/" className="text-2xl font-bold text-primary flex items-center mb-8">
                <Leaf className="mr-2 h-6 w-6" />
                OrginTrace
            </Link>
            <Card className="w-full max-w-md">
                <form ref={ref}
                    action={handleSubmit}>
                    <CardHeader>
                        <CardTitle className="text-2xl text-center text-primary">Create an Account</CardTitle>
                        <CardDescription className="text-center">Sign up to start exploring Kerala</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && <div className="">{error}</div>}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" name="name" type="text" placeholder="Enter your full name" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="Enter your email" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" placeholder="Create a password" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm Password</Label>
                                <Input id="confirm-password" name="confirm-password" type="password" placeholder="Confirm your password" required />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button className="w-full bg-primary hover:bg-accent text-white">Sign Up</Button>
                        <div className="text-sm text-center text-accent">
                            Already have an account?{' '}
                            <Link href="/login" className="text-primary hover:underline">
                                Sign in
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div >)
}
