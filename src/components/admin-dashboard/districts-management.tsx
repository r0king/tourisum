'use client'

import React from 'react'
import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { IDistrict } from '@/models/district'
import { getAllDistricts, createDistrict, updateDistrict, deleteDistrict, addDestination, updateDestination, deleteDestination, addFoodSpot, updateFoodSpot, deleteFoodSpot, addEvent, updateEvent, deleteEvent } from '@/actions/district-actions'
import DestinationsTable from './destinations-table'
import FoodSpotsTable from './food-spots-table'
import EventsTable from './events-table'

interface DistrictsManagementProps {
    initialDistricts: IDistrict[];
}

export function DistrictsManagement({ initialDistricts }: DistrictsManagementProps) {
    const [districts, setDistricts] = React.useState(initialDistricts)
    const [isRefreshing, setIsRefreshing] = React.useState(false);

    const refetchDistricts = async () => {
        try {
            setIsRefreshing(true);
            const districts = await getAllDistricts();
            setDistricts(districts);
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleCreateDistrict = async (districtData: Partial<IDistrict>) => {
        await createDistrict(districtData)
        refetchDistricts()
    }

    const handleUpdateDistrict = async (districtId: string, districtData: Partial<IDistrict>) => {
        await updateDistrict(districtId, districtData)
        refetchDistricts()
    }

    const handleDeleteDistrict = async (districtId: string) => {
        await deleteDistrict(districtId)
        refetchDistricts()
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Districts Management</h2>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" /> Add District
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New District</DialogTitle>
                            <DialogDescription>Add a new district and its details below.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                            e.preventDefault()
                            const formData = new FormData(e.currentTarget)
                            const districtData = {
                                name: formData.get('name') as string,
                                description: formData.get('description') as string,
                                pincode: formData.get('pincode') as string,
                            }
                            handleCreateDistrict(districtData)
                        }}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" name="name" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" name="description" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="pincode">Pincode</Label>
                                    <Input id="pincode" name="pincode" required />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit">
                                    Create District
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {districts.map((district) => (
                <Card key={district._id?.toString()}>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>{district.name}</CardTitle>
                            <div className="space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={refetchDistricts}
                                    disabled={isRefreshing}
                                >
                                    <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                                    Refresh
                                </Button>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <Edit className="w-4 h-4 mr-2" /> Edit
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Edit District</DialogTitle>
                                            <DialogDescription>Update district details below.</DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                                            e.preventDefault()
                                            const formData = new FormData(e.currentTarget)
                                            const districtData = {
                                                name: formData.get('name') as string,
                                                description: formData.get('description') as string,
                                                pincode: formData.get('pincode') as string,
                                            }
                                            handleUpdateDistrict(district._id?.toString() ?? '', districtData)
                                        }}>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="name">Name</Label>
                                                    <Input id="name" name="name" defaultValue={district.name}  />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="description">Description</Label>
                                                    <Textarea id="description" name="description" defaultValue={district.description}  />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="pincode">Pincode</Label>
                                                    <Input id="pincode" name="pincode" defaultValue={district.pincode}  />
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                <Button type="submit">
                                                    Save Changes
                                                </Button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteDistrict(district._id?.toString() ?? '')}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                                </Button>
                            </div>
                        </div>
                        <CardDescription>{district.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible>
                            <AccordionItem value="destinations">
                                <AccordionTrigger>Destinations</AccordionTrigger>
                                <AccordionContent>
                                    <DestinationsTable
                                        districtId={district._id?.toString() ?? ''}
                                        destinations={district.destinations}
                                        onAdd={addDestination}
                                        onUpdate={updateDestination}
                                        onDelete={deleteDestination}
                                    />
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="foodspots">
                                <AccordionTrigger>Food Spots</AccordionTrigger>
                                <AccordionContent>
                                    <FoodSpotsTable
                                        districtId={district._id?.toString() ?? ''}
                                        foodSpots={district.foodSpots}
                                        onAdd={addFoodSpot}
                                        onUpdate={updateFoodSpot}
                                        onDelete={deleteFoodSpot}
                                    />
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="events">
                                <AccordionTrigger>Events</AccordionTrigger>
                                <AccordionContent>
                                    <EventsTable
                                        districtId={district._id?.toString() ?? ''}
                                        events={district.events}
                                        onAdd={addEvent}
                                        onUpdate={updateEvent}
                                        onDelete={deleteEvent}
                                    />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}