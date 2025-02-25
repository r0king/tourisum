'use client'

import Link from 'next/link'
import Image from 'next/image'
import { signOut } from "next-auth/react"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MapPin, Utensils, User, Leaf, ChevronLeft, ChevronRight, Menu } from 'lucide-react'
import { useRef, useState } from 'react'

interface HomePageProps {
  authStatus: "authenticated" | "loading" | "unauthenticated"
  router: AppRouterInstance
}

export default function HomePage({ authStatus, router }: HomePageProps) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth
      carouselRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  const renderAuthButton = () => {
    if (authStatus === "authenticated") {
      return (
        <div className="flex gap-4">
          {/* Profile Link */}
          <Link href="/profile">
            <Button variant="default">Profile</Button>
          </Link>
  
          {/* Sign Out Button */}
          <Button
            variant="outline"
            onClick={() => {
              signOut({ redirect: false }).then(() => {
                router.push("/");
              });
            }}
          >
            Sign Out
          </Button>
        </div>
      );
    } else if (authStatus === "loading") {
      return <span className="text-sm text-muted-foreground">Loading...</span>
    } else {
      return (
        <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-primary">
          Sign In
        </Link>
      )
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="bg-card shadow-md relative z-20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl sm:text-2xl font-bold text-primary flex items-center">
            <Leaf className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
            OrginTrace
          </Link>
          <nav className="hidden md:flex space-x-4">
            <Link href="/map" className="text-sm my-auto font-medium text-muted-foreground hover:text-primary">Explore</Link>
            {renderAuthButton()}
          </nav>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
            <Menu className="h-6 w-6 text-muted-foreground" />
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-card shadow-md py-2">
            <Link href="/map" className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary">Explore</Link>
            <div className="px-4 py-2">
              {renderAuthButton()}
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        <section className="relative py-16 sm:py-20 md:py-32 bg-primary text-primary-foreground overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">Discover Kerala&apos;s Hidden Gems</h1>
              <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 opacity-90">Explore the rich heritage and untold stories of God&apos;s Own Country</p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
                  <Link href="/map">Start Exploring</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground bg-primary">
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/beach.jpg"
              alt="Beautiful landscape of Kerala"
              layout="fill"
              objectFit="cover"
              className="opacity-20"
            />
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {[
                { icon: MapPin, title: 'Explore Districts', description: 'Discover the unique charm of each Kerala district' },
                { icon: Utensils, title: 'Local Cuisine', description: 'Savor authentic Kerala flavors and delicacies' },
                { icon: User, title: 'Expert Guides', description: 'Connect with knowledgeable local guides for immersive experiences' },
              ].map((feature, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <feature.icon className="w-10 h-10 sm:w-12 sm:h-12 mb-4 text-primary" />
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-secondary-foreground">Recommended Travel Plans</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {['Backwaters Bliss', 'Hill Station Haven', 'Coastal Charm'].map((plan) => (
                <Card key={plan}>
                  <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl text-primary">{plan}</CardTitle>
                    <CardDescription className="text-sm sm:text-base">5 days of unforgettable experiences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Discover the beauty of Kerala through our carefully curated itinerary.</p>
                    <Button className="mt-4 w-full sm:w-auto">View Itinerary</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-card">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-primary">Explore Districts</h2>
            <div className="relative">
              <div ref={carouselRef} className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
                {['Wayanad', 'Idukki', 'Alappuzha', 'Kochi', 'Thiruvananthapuram', 'Kozhikode'].map((district) => (
                  <Link href={`/district/${district.toLowerCase()}`} key={district} className="snap-start shrink-0 w-64 sm:w-72 mx-2">
                    <Card className="h-full">
                      <CardContent className="pt-6">
                        <Image
                          src={`/placeholder.svg?height=200&width=300`}
                          alt={`${district} landscape`}
                          width={300}
                          height={200}
                          className="rounded-t-lg mb-4"
                        />
                        <h3 className="font-semibold text-lg mb-2 text-primary">{district}</h3>
                        <p className="text-sm text-muted-foreground">Discover the beauty of {district}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-card hidden sm:flex"
                onClick={() => scroll('left')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-card hidden sm:flex"
                onClick={() => scroll('right')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Become a Local Guide</h2>
            <p className="mb-6 sm:mb-8 text-sm sm:text-base opacity-90">Share your knowledge and passion for Kerala with travelers from around the world</p>
            <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
              <Link href="/apply-as-guide">Apply as a Guide</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-muted text-muted-foreground">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
                <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">Explore</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/destinations" className="hover:text-primary">Destinations</Link></li>
                <li><Link href="/food-spots" className="hover:text-primary">Food Spots</Link></li>
                <li><Link href="/events" className="hover:text-primary">Events</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">Connect</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary">Facebook</a></li>
                <li><a href="#" className="hover:text-primary">Instagram</a></li>
                <li><a href="#" className="hover:text-primary">Twitter</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">Newsletter</h3>
              <p className="mb-4 text-sm">Stay updated with our latest offers and news</p>
              <form className="flex flex-col sm:flex-row">
                <input type="email" placeholder="Your email" className="px-3 py-2 bg-background text-foreground rounded-t-md sm:rounded-l-md sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-primary w-full" />
                <Button type="submit" className="rounded-b-md sm:rounded-r-md sm:rounded-l-none w-full sm:w-auto">Subscribe</Button>
              </form>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm">
            <p>&copy; 2024 OrginTrace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}