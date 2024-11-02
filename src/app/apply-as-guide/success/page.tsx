import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, CheckCircle, Clock, Mail } from 'lucide-react'

export default function GuideApplicationConfirmationPage() {
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

      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-primary flex items-center justify-center">
              <CheckCircle className="mr-2 h-6 w-6 text-[#687864]" />
              Application Submitted Successfully
            </CardTitle>
            <CardDescription className="text-center text-muted">Thank you for applying to be a local guide with OrginTrace</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-lg font-semibold text-primary mb-2">What happens next?</p>
              <ul className="space-y-4">
                <li className="flex items-center justify-center">
                  <Clock className="mr-2 h-5 w-5 text-[#5085A5]" />
                  <span>Our team will review your application within 5-7 business days</span>
                </li>
                <li className="flex items-center justify-center">
                  <Mail className="mr-2 h-5 w-5 text-[#5085A5]" />
                  <span>You will receive an email notification about the status of your application</span>
                </li>
              </ul>
            </div>
            <div className="bg-[#8FC1E3] bg-opacity-20 rounded-lg p-4">
              <p className="text-center text-sm text-[#31708E]">
                If you have any questions or need to update your application, please contact our support team at{' '}
                <a href="mailto:support@orgintrace.com" className="font-semibold hover:underline">
                  support@orgintrace.com
                </a>
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/">Return to Homepage</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>

      <footer className="bg-[#31708E] text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 OrginTrace. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <Link href="/privacy" className="text-sm hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="text-sm hover:underline">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}