"use client";
import { FormEvent, useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { Eye, EyeOff, Leaf } from "lucide-react";
import { ExtendedUser } from "@/lib/auth"; 

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{ email: string; password: string | null }>({
    email: "",
    password: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Validation function
  const validateField = (name: string, value: string) => {
    let errorMessage = "";

    switch (name) {
      case "email":
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value))
          errorMessage = "Invalid email format.";
        break;
      case "password":
        if (value.length < 6)
          errorMessage = "Password must be at least 6 characters.";
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

  // Handle input changes and validate in real-time
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Check if there are validation errors
    if (Object.values(errors).some((err) => err) || !formData.email || !formData.password) {
      toast.error("Please fix the errors before submitting.", {
        position: "bottom-center",
      });
      return;
    }

    setIsLoading(true);

    const res = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    console.log(res);

    setIsLoading(false);

    if (res?.error) {
      setErrors((prev) => ({ ...prev, password: res.error }));
      toast.error(res.error, {
        position: "bottom-center",
      });
    }

    if (res?.ok) {
      toast.success("Login successful!", {
        position: "bottom-center",
      });

      // Get session to check user role
      const session = await getSession();
      console.log("Session:", session); // Log session to inspect its structure
      if ((session?.user as ExtendedUser)?.role === 'admin') {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex flex-col justify-center items-center p-4">
      <Link href="/" className="text-2xl font-bold text-primary flex items-center mb-8">
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
            <div className="space-y-4">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 h-6 w-6 px-1 opacity-50 hover:opacity-100"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {/* Sign In Button */}
            <Button
              className="w-full bg-primary hover:bg-secondary text-white"
              disabled={isLoading || Object.values(errors).some((err) => err)}
            >
              {isLoading ? "Loading..." : "Sign In"}
            </Button>

            {/* Redirect to Register */}
            <div className="text-sm text-center text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>

            {/* Guide Sign-in */}
            <Link href="/guide-signin" className="text-sm text-center text-primary hover:underline">
              Sign in as a guide
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
