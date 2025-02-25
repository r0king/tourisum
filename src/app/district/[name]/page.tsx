import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { connectDB } from "@/lib/mongodb"
import District from "@/models/district"
import { Leaf, MapPin, Utensils, Calendar, ChevronDown, Star, Hotel } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReviewModal } from '@/components/district/review-modal'
import { ReviewsModal } from '@/components/district/reviews-modal'

interface Destination {
    averageRating: number
    reviewCount: number
    _id: string
    imageUrl: string
    name: string
    type: string
    description: string
}

interface FoodSpot {
    averageRating: number
    reviewCount: number
    _id: string
    name: string
    cuisine: string
    description: string
    location: string
}

interface Event {
    name: string
    date: string
    description: string
    location: string
}

interface Hotel {
    _id: string
    name: string
    description: string
    location: string
    price: number
    rating: number
    averageRating: number
    reviewCount: number
}

interface DistrictData {
    _id: string
    name: string
    description: string
    destinations: Destination[]
    foodSpots: FoodSpot[]
    events: Event[]
    hotels: Hotel[]
}

async function getDistrictData(name: string): Promise<DistrictData | null> {
    await connectDB()
    const district = await District.findOne({ name: { $regex: new RegExp(`^${name}`, 'i') } })

    if (!district) {
        return null
    }
    return JSON.parse(JSON.stringify(district))
}

export default async function DistrictPage({ params }: { params: { name: string } }) {
    const districtData = await getDistrictData(params.name)

    if (!districtData) {
        notFound()
    }

    return (
        <div className="bg-background text-foreground">
            <header className="relative h-screen max-h-[720px] overflow-hidden">
            <div className="fixed top-4 right-4 z-10">
            <Link href={`/district/${districtData.name}/book-guide`} passHref>
                    <Button variant="default" className="px-6 py-2 text-lg">
                        Book a guide
                    </Button>
                    </Link>
                </div>
                <Image
                    src={districtData.destinations[0]?.imageUrl || '/images/district.jpg'}
                    alt={districtData.name}
                    layout="fill"
                    objectFit="cover"
                    priority
                />
                <div className="absolute inset-0 bg-primary/60 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold text-white mb-4">{districtData.name}</h1>
                        <p className="text-xl text-white max-w-2xl mx-auto">{districtData.description}</p>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                    <ChevronDown className="text-white animate-bounce" size={48} />
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <Tabs defaultValue="destinations" className="w-full">
                    <TabsList className="grid w-full text-primary-foreground grid-cols-4 mb-8">
                        <TabsTrigger value="destinations">Destinations</TabsTrigger>
                        <TabsTrigger value="food">Food Spots</TabsTrigger>
                        <TabsTrigger value="events">Events</TabsTrigger>
                        <TabsTrigger value="hotels">Hotels</TabsTrigger>
                    </TabsList>
                    <TabsContent value="destinations">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {districtData.destinations.map((destination: Destination) => (
                                <Card key={destination._id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                    <Image
                                        src={destination.imageUrl || '/placeholder.svg'}
                                        alt={destination.name}
                                        width={400}
                                        height={300}
                                        className="w-full h-48 object-cover"
                                    />
                                    <CardHeader>
                                        <CardTitle>{destination.name}</CardTitle>
                                        <CardDescription>{destination.type}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p>{destination.description}</p>
                                    </CardContent>
                                    <CardFooter className="flex flex-col items-start gap-2">
                                        <div className="flex items-center w-full justify-between">
                                            <ReviewsModal
                                                itemId={destination._id}
                                                itemType="destination"
                                                itemName={destination.name}
                                            >
                                                <div className="flex items-center">
                                                    <Star className="text-yellow-400 mr-1" />
                                                    <span>{destination.averageRating.toFixed(1)} ({destination.reviewCount} reviews)</span>
                                                </div>
                                            </ReviewsModal>
                                            <ReviewModal
                                                itemId={destination._id}
                                                itemType="destination"
                                                itemName={destination.name}
                                                districtId={districtData._id}
                                            />
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="food">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {districtData.foodSpots.map((foodSpot: FoodSpot) => (
                                <Card key={foodSpot._id} className="hover:shadow-lg transition-shadow duration-300">
                                    <CardHeader>
                                        <CardTitle className="flex items-center ">
                                            <Utensils className="mr-2" size={20} />
                                            {foodSpot.name}
                                        </CardTitle>
                                        <CardDescription>{foodSpot.cuisine}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="mb-2 line-clamp-3">{foodSpot.description}</p>
                                        <p className="flex items-center text-muted-foreground">
                                            <MapPin className="mr-2" size={16} />
                                            {foodSpot.location}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="flex flex-col items-start gap-2">
                                        <div className="flex items-center w-full justify-between">
                                            <ReviewsModal
                                                itemId={foodSpot._id}
                                                itemType="foodSpot"
                                                itemName={foodSpot.name}
                                            >
                                                <div className="flex items-center">
                                                    <Star className="text-yellow-400 mr-1" />
                                                    <span>{foodSpot.averageRating.toFixed(1)} ({foodSpot.reviewCount} reviews)</span>
                                                </div>
                                            </ReviewsModal>
                                            <ReviewModal
                                                itemId={foodSpot._id}
                                                itemType="foodSpot"
                                                itemName={foodSpot.name}
                                                districtId={districtData._id}
                                            />
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="events">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {districtData.events.map((event: Event, index: number) => (
                                <Card key={index} className='hover:shadow-lg transition-shadow duration-300'>
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <Calendar className="mr-2" size={20} />
                                            {event.name}
                                        </CardTitle>
                                        <CardDescription>
                                            {new Date(event.date).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="mb-2">{event.description}</p>
                                        <p className="flex items-center text-muted-foreground">
                                            <MapPin className="mr-2" size={16} />
                                            {event.location}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="hotels">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {districtData.hotels.map((hotel: Hotel) => (
                                <Card key={hotel._id} className='hover:shadow-lg transition-shadow duration-300'>
                                    <CardHeader>
                                        <CardTitle className="flex items-center capitalize">
                                            <Hotel className="mr-2 " size={20} />
                                            {hotel.name}
                                        </CardTitle>
                                        <CardDescription>
                                            ₹{hotel.price} per night
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="mb-2">{hotel.description}</p>
                                        <p className="flex items-center text-muted-foreground mb-2">
                                            <MapPin className="mr-2" size={16} />
                                            {hotel.location}
                                        </p>
                                    </CardContent>
                                    <CardFooter>
                                        <div className="flex items-center w-full justify-between">
                                            <ReviewsModal
                                                itemId={hotel._id}
                                                itemType="hotel"
                                                itemName={hotel.name}
                                            >
                                                <div className="flex items-center">
                                                    <Star className="text-yellow-400 mr-1" />
                                                    <span>{hotel.averageRating.toFixed(1)} ({hotel.reviewCount} reviews)</span>
                                                </div>
                                            </ReviewsModal>

                                            <ReviewModal
                                                itemId={hotel._id}
                                                itemType="hotel"
                                                itemName={hotel.name}
                                                districtId={districtData._id}
                                            />
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </main>

            <footer className="bg-primary text-primary-foreground py-8">
                <div className="container mx-auto px-4">
                    <Link href="/" passHref>
                        <Button variant="secondary" className="w-full sm:w-auto">
                            <Leaf className="mr-2" size={16} />
                            Back to Districts
                        </Button>
                    </Link>
                </div>
            </footer>
        </div>
    )
}