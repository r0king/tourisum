import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Leaf, MapPin, Languages, Award } from 'lucide-react'

export default function ApplyAsGuidePage() {
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
          <CardHeader>
            <CardTitle className="text-2xl text-center text-primary">Apply as a Local Guide</CardTitle>
            <CardDescription className="text-center text-muted">Share your knowledge and passion for Kerala with travelers</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter your full name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="Enter your phone number" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Primary Location</Label>
                <Select>
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
                <Input id="languages" placeholder="e.g., English, Malayalam, Hindi" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input id="experience" type="number" placeholder="Enter number of years" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialties">Areas of Expertise</Label>
                <Textarea id="specialties" placeholder="e.g., History, Culture, Nature, Adventure" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about">Tell us about yourself</Label>
                <Textarea id="about" placeholder="Share your passion for Kerala and why you'd make a great guide" required />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Submit Application</Button>
          </CardFooter>
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