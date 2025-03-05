"use client";
import { useState } from "react";
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
import { Eye, EyeOff, Leaf } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Helper function to validate form fields
  const validateField = (name: string, value: string) => {
    let errorMessage = "";

    switch (name) {
      case "name":
        if (!value.trim()) errorMessage = "Full Name is required.";
        break;
      case "email":
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value))
          errorMessage = "Invalid email address.";
        break;
      case "password":
        if (value.length < 6)
          errorMessage = "Password must be at least 6 characters.";
        break;
      case "confirmPassword":
        if (value !== formData.password) errorMessage = "Passwords do not match.";
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Check for any existing errors before submitting
    if (Object.values(errors).some((err) => err) || Object.values(formData).some((val) => !val)) {
      toast.error("Please fix the errors before submitting.", {
        position: "bottom-center",
      });
      return;
    }

    try {
      setIsLoading(true);

      await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });

      toast.success("Signup successful!", {
        position: "bottom-center",
      });

      router.push("/login");
    } catch (error) {
      console.error("Error signing up: ", error);
      toast.error("An unexpected error occurred.", {
        position: "bottom-center",
      });
    } finally {
      setIsLoading(false);
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
              Create an Account
            </CardTitle>
            <CardDescription className="text-center">
              Sign up to start exploring Kerala
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Name Input */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

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

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {/* Sign Up Button */}
            <Button
              className="w-full bg-primary hover:bg-accent text-white"
              disabled={isLoading || Object.values(errors).some((err) => err)}
            >
              {isLoading ? "Loading..." : "Sign Up"}
            </Button>

            {/* Redirect to Login */}
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
