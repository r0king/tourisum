'use client'

import React from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
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
import { IEvent } from '@/models/district'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

function EventsTable({
    districtId,
    events,
    onAdd,
    onUpdate,
    onDelete
}: {
    districtId: string;
    events: IEvent[];
    onAdd: (districtId: string, data: Partial<IEvent>) => Promise<void>;
    onUpdate: (districtId: string, eventId: string, data: Partial<IEvent>) => Promise<void>;
    onDelete: (districtId: string, eventId: string) => Promise<void>;
}) {
    const [isPending, startTransition] = React.useTransition()
    const [addOpen, setAddOpen] = React.useState(false)
    const addFormRef = React.useRef<HTMLFormElement>(null)

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Dialog open={addOpen} onOpenChange={setAddOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" /> Add Event
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Event</DialogTitle>
                            <DialogDescription>Enter event details below.</DialogDescription>
                        </DialogHeader>
                        <form ref={addFormRef} onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                            e.preventDefault()
                            const formData = new FormData(e.currentTarget)
                            const data: Partial<IEvent> = {
                                name: formData.get('name') as string,
                                date: new Date(formData.get('date') as string),
                                description: formData.get('description') as string,
                                location: formData.get('location') as string,
                                status: 'pending'
                            }
                            startTransition(async () => {
                                await onAdd(districtId, data)
                                addFormRef.current?.reset()
                                setAddOpen(false)
                            })
                        }}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" name="name" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="date">Date</Label>
                                    <Input id="date" name="date" type="datetime-local" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" name="description" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input id="location" name="location" required />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? 'Adding...' : 'Add Event'}
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
                        <TableHead>Date</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {events?.map((event) => (
                        <TableRow key={event._id.toString()}>
                            <TableCell>{event.name}</TableCell>
                            <TableCell>{new Date(event.date).toLocaleString()}</TableCell>
                            <TableCell>{event.location}</TableCell>
                            <TableCell>{event.status}</TableCell>
                            <TableCell className="space-x-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <Edit className="w-4 h-4 mr-1" /> Edit
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Edit Event</DialogTitle>
                                            <DialogDescription>Update event details below.</DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                                            e.preventDefault()
                                            const formData = new FormData(e.currentTarget)
                                            const data: Partial<IEvent> = {
                                                name: formData.get('name') as string,
                                                date: new Date(formData.get('date') as string),
                                                description: formData.get('description') as string,
                                                location: formData.get('location') as string,
                                                status: formData.get('status') as 'pending' | 'approved' | 'rejected'
                                            }
                                            startTransition(() => onUpdate(districtId, event._id.toString(), data))
                                        }}>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="name">Name</Label>
                                                    <Input id="name" name="name" defaultValue={event.name} required />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="date">Date</Label>
                                                    <Input 
                                                        id="date" 
                                                        name="date" 
                                                        type="datetime-local" 
                                                        defaultValue={new Date(event.date).toISOString().slice(0, 16)}
                                                        required 
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="description">Description</Label>
                                                    <Textarea id="description" name="description" defaultValue={event.description} required />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="location">Location</Label>
                                                    <Input id="location" name="location" defaultValue={event.location} required />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="status">Status</Label>
                                                    <Select name="status" defaultValue={event.status}>
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
                                    onClick={() => startTransition(() => onDelete(districtId, event._id.toString()))}
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

export default EventsTable