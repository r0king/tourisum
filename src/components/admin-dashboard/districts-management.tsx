'use client'

import React from 'react'
import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
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
import { IDestination, IDistrict } from '@/models/district'
import { getAllDistricts, createDistrict, updateDistrict, deleteDistrict, addDestination, updateDestination, deleteDestination, addFoodSpot, updateFoodSpot, deleteFoodSpot, addEvent, updateEvent, deleteEvent } from '@/actions/district-actions'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

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
                                            }
                                            handleUpdateDistrict(district._id?.toString() ?? '', districtData)
                                        }}>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="name">Name</Label>
                                                    <Input id="name" name="name" defaultValue={district.name} required />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="description">Description</Label>
                                                    <Textarea id="description" name="description" defaultValue={district.description} required />
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

function DestinationsTable({
    districtId,
    destinations,
    onAdd,
    onUpdate,
    onDelete
}: {
    districtId: string;
    destinations: IDestination[];
    onAdd: (districtId: string, data: Partial<IDestination>) => Promise<void>;
    onUpdate: (districtId: string, destinationId: string, data: Partial<IDestination>) => Promise<void>;
    onDelete: (districtId: string, destinationId: string) => Promise<void>;
}) {
    const [isPending, startTransition] = React.useTransition()

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" /> Add Destination
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Destination</DialogTitle>
                            <DialogDescription>Enter destination details below.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                            e.preventDefault()
                            const formData = new FormData(e.currentTarget)
                            const data: Partial<IDestination> = {
                                name: formData.get('name') as string,
                                type: formData.get('type') as string,
                                description: formData.get('description') as string,
                                imageUrl: formData.get('imageUrl') as string,
                                status: 'pending'
                            }
                            startTransition(() => onAdd(districtId, data))
                        }}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" name="name" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="type">Type</Label>
                                    <Input id="type" name="type" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" name="description" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="imageUrl">Image URL</Label>
                                    <Input id="imageUrl" name="imageUrl" type="url" required />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? 'Adding...' : 'Add Destination'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {destinations?.map((destination) => (
                        <TableRow key={destination._id.toString()}>
                            <TableCell>{destination.name}</TableCell>
                            <TableCell>{destination.type}</TableCell>
                            <TableCell>{destination.averageRating.toFixed(1)} ({destination.reviewCount})</TableCell>
                            <TableCell>{destination.status}</TableCell>
                            <TableCell className="space-x-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <Edit className="w-4 h-4 mr-1" /> Edit
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Edit Destination</DialogTitle>
                                            <DialogDescription>Update destination details below.</DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                                            e.preventDefault()
                                            const formData = new FormData(e.currentTarget)
                                            const data: Partial<IDestination> = {
                                                name: formData.get('name') as string,
                                                type: formData.get('type') as string,
                                                description: formData.get('description') as string,
                                                imageUrl: formData.get('imageUrl') as string,
                                                status: formData.get('status') as 'pending' | 'approved' | 'rejected'
                                            }
                                            startTransition(() => onUpdate(districtId, destination._id.toString(), data))
                                        }}>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="name">Name</Label>
                                                    <Input id="name" name="name" defaultValue={destination.name} required />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="type">Type</Label>
                                                    <Input id="type" name="type" defaultValue={destination.type} required />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="description">Description</Label>
                                                    <Textarea id="description" name="description" defaultValue={destination.description} required />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="imageUrl">Image URL</Label>
                                                    <Input id="imageUrl" name="imageUrl" type="url" defaultValue={destination.imageUrl} required />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="status">Status</Label>
                                                    <Select name="status" defaultValue={destination.status}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="pending">Pending</SelectItem>
                                                            <SelectItem value="approved">Approved</SelectItem>
                                                            <SelectItem value="rejected">Rejected</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                <Button type="submit" disabled={isPending}>
                                                    {isPending ? 'Saving...' : 'Save Changes'}
                                                </Button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => startTransition(() => onDelete(districtId, destination._id.toString()))}
                                    disabled={isPending}
                                >
                                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function FoodSpotsTable({ districtId, foodSpots, onAdd, onUpdate, onDelete }) {
    // Implementation similar to other tables with specific fields for food spots
    return <div>{/* Table implementation */}</div>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function EventsTable({ districtId, events, onAdd, onUpdate, onDelete }) {
    // Implementation similar to other tables with specific fields for events
    return <div>{/* Table implementation */}</div>
}