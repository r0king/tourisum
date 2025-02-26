"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/actions/register";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Leaf } from "lucide-react";

export default function Register() {
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError(undefined);
    const r = await register({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      name: formData.get("name") as string,
    });
    ref.current?.reset();
    setIsLoading(false);
    if (r?.error) {
      setError(r.error);
      toast.error(r.error, {
        position: "bottom-center",
      });
      return;
    } else {
      toast.success("Signup successful!", {
        position: "bottom-center",
      });
      router.push("/login"); // Redirect to login after successful signup
      return;
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
        <form ref={ref} action={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl text-center text-primary">
              Create an Account
            </CardTitle>
            <CardDescription className="text-center">
              Sign up to start exploring Kerala
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && <div className="">{error}</div>}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  required
                />
              </div>
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
                  placeholder="Create a password"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              className="w-full bg-primary hover:bg-accent text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    aria-hidden="true"
                    className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4002 91.5082 50 91.5082C72.5998 91.5082 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5998 9.67348 50 9.67348C27.4002 9.67348 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.8734 24.4829 89.7673 21.4569C86.6611 18.4309 82.8207 16.3778 78.6422 14.9052C74.4638 13.4325 69.9192 12.6023 65.2799 12.4207C60.6406 12.2392 55.9005 12.7058 51.5052 13.8157C47.1099 14.9256 43.0577 16.6733 39.4798 18.9827C35.9018 21.2921 32.8102 24.2248 30.2299 27.6705C27.6496 31.1162 25.5374 35.0329 24.229 39.2188C22.9206 43.4046 22.2787 47.8695 22.2887 52.3455C22.2987 56.8215 22.9487 61.2868 24.2548 65.7177C25.5608 70.1487 27.5212 74.4869 30.112 78.4074C32.7028 82.3279 35.934 85.8206 39.6957 88.778C43.4574 91.7354 47.7345 94.1448 52.2481 95.8318C56.7617 97.5187 61.5148 98.4483 66.2585 98.4223C70.9921 98.3964 75.5318 97.4003 79.8887 95.4005C84.2456 93.4007 88.2124 90.531 91.6173 86.8529C95.0222 83.1748 97.8258 78.8272 99.9553 73.8767C102.085 68.9262 103.38 63.5743 103.874 58.194C104.368 52.8137 104.014 47.3562 102.801 42.069C101.587 36.7817 99.5392 31.6195 96.7099 26.6419C93.8805 21.6642 90.287 17.0192 85.9794 12.7859C81.6717 8.5526 76.6007 4.77707 70.8588 1.50053C65.1168 -1.77601 58.6864 -4.07747 51.9886 -4.08679C45.2907 -4.0961 38.8449 -2.02602 32.7909 0.161593C26.737 2.34921 21.0982 5.38963 16.1982 9.19213C11.2983 12.9946 7.03502 17.4084 3.42249 22.4153C-0.190048 27.4221 -2.08675 32.8825 -2.03712 38.3782C-1.98749 43.8739 0.086437 49.2928 3.05211 54.3839C6.01779 59.475 9.8638 64.2724 14.5601 68.5347C19.2565 72.797 24.7701 76.5484 30.9938 79.7003C37.2176 82.8522 44.1423 85.3787 51.5052 87.2385C58.868 89.0983 66.6082 90.2267 74.479 90.5428C82.3498 90.8589 90.2837 90.3501 97.9676 88.9509C93.9676 39.0409 93.9676 39.0409 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                  Loading...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            <div className="text-sm text-center text-accent">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
