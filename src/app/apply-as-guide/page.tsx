"use client"
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Leaf, MapPin, Languages, Award } from 'lucide-react'
import { registerGuide } from "@/actions/register-guide";

export default function ApplyAsGuidePage() {
  const [error, setError] = useState<string>();
  const router = useRouter();
  const ref = useRef<HTMLFormElement>(null);
  const handleSubmit = async (formData: FormData) => {
    const r = await registerGuide({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      phone: formData.get("phone") as string,
      location: formData.get("location") as string,
      languages: (formData.get("languages") as string).split(','),
      experience: Number(formData.get("experience")),
      specialties: (formData.get("specialties") as string).split(','),
      about: formData.get("about") as string,
    });
    ref.current?.reset();
    if (r?.error) {
      setError(r.error);
      return;
    } else {
      return router.push("/apply-as-guide/success");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB] flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary flex items-center">
            <Leaf className="mr-2 h-6 w-6" />
            OrginTrace
          </Link>
          <nav className="space-x-4">
            <Link href="/" className="text-sm font-medium text-muted hover:text-primary">Home</Link>
            <Link href="/explore" className="text-sm font-medium text-muted hover:text-primary">Explore</Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="w-full max-w-2xl mx-auto">
          <form ref={ref}
            action={handleSubmit}>
            <CardHeader>
              <CardTitle className="text-2xl text-center text-primary">Apply as a Local Guide</CardTitle>
              <CardDescription className="text-center text-muted">Share your knowledge and passion for Kerala with travelers</CardDescription>
            </CardHeader>
            <CardContent>
              {error && <div className="">{error}</div>}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="Enter your full name" required />
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
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" placeholder="Enter your phone number" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Primary Location</Label>
                <Select name="location">
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Select your primary location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wayanad">Wayanad</SelectItem>
                    <SelectItem value="idukki">Idukki</SelectItem>
                    <SelectItem value="alappuzha">Alappuzha</SelectItem>
                    <SelectItem value="kochi">Kochi</SelectItem>
                    <SelectItem value="thiruvananthapuram">Thiruvananthapuram</SelectItem>
                    <SelectItem value="kozhikode">Kozhikode</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="languages">Languages Spoken</Label>
                <Input id="languages" name="languages" placeholder="e.g., English, Malayalam, Hindi" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input id="experience" name="experience" type="number" placeholder="Enter number of years" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialties">Areas of Expertise</Label>
                <Textarea id="specialties" name="specialties" placeholder="e.g., History, Culture, Nature, Adventure" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about">Tell us about yourself</Label>
                <Textarea id="about" name="about" placeholder="Share your passion for Kerala and why you'd make a great guide" required />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Submit Application</Button>
            </CardFooter>
          </form>
        </Card>
      </main>

      <footer className="bg-[#31708E] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <MapPin className="h-5 w-5" />
              <span>Explore Kerala&apos;s Hidden Gems</span>
            </div>
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Languages className="h-5 w-5" />
              <span>Multiple Language Support</span>
            </div>
            <div className="flex items-center space-x-4">
              <Award className="h-5 w-5" />
              <span>Expert Local Guides</span>
            </div>
          </div>
          <div className="mt-8 text-center text-sm">
            <p>&copy; 2024 OrginTrace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}