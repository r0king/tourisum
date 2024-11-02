import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { connectDB } from "@/lib/mongodb"
import District from "@/models/district"
import { Leaf, MapPin, Utensils, Calendar, ChevronDown } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Destination {
    imageUrl: string
    name: string
    type: string
    description: string
}

interface FoodSpot {
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

interface DistrictData {
    name: string
    description: string
    destinations: Destination[]
    foodSpots: FoodSpot[]
    events: Event[]
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
        <div className="min-h-screen bg-background text-foreground">
            <header className="relative h-screen max-h-[720px] overflow-hidden">
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
                    <TabsList className="grid w-full text-primary-foreground grid-cols-3 mb-8">
                        <TabsTrigger value="destinations">Destinations</TabsTrigger>
                        <TabsTrigger value="food">Food Spots</TabsTrigger>
                        <TabsTrigger value="events">Events</TabsTrigger>
                    </TabsList>
                    <TabsContent value="destinations">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {districtData.destinations.map((destination: Destination, index: number) => (
                                <Card key={index} className="overflow-hidden">
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
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="food">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {districtData.foodSpots.map((foodSpot: FoodSpot, index: number) => (
                                <Card key={index}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center ">
                                            <Utensils className="mr-2" size={20} />
                                            {foodSpot.name}
                                        </CardTitle>
                                        <CardDescription>{foodSpot.cuisine}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="mb-2">{foodSpot.description}</p>
                                        <p className="flex items-center text-muted-foreground">
                                            <MapPin className="mr-2" size={16} />
                                            {foodSpot.location}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="events">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {districtData.events.map((event: Event, index: number) => (
                                <Card key={index}>
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