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
import { IDestination } from '@/models/district'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

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
    const [isAddOpen, setIsAddOpen] = React.useState(false)
    const [editingDestId, setEditingDestId] = React.useState<string | null>(null)
    const addFormRef = React.useRef<HTMLFormElement>(null)
    const editFormRef = React.useRef<HTMLFormElement>(null)

    const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const data: Partial<IDestination> = {
            name: formData.get('name') as string,
            type: formData.get('type') as string,
            description: formData.get('description') as string,
            imageUrl: formData.get('imageUrl') as string,
            status: 'pending'
        }
        
        startTransition(async () => {
            await onAdd(districtId, data)
            addFormRef.current?.reset()
            setIsAddOpen(false)
        })
    }

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>, destinationId: string) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const data: Partial<IDestination> = {
            name: formData.get('name') as string,
            type: formData.get('type') as string,
            description: formData.get('description') as string,
            imageUrl: formData.get('imageUrl') as string,
            status: formData.get('status') as 'pending' | 'approved' | 'rejected'
        }
        
        startTransition(async () => {
            await onUpdate(districtId, destinationId, data)
            setEditingDestId(null)
        })
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
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
                        <form ref={addFormRef} onSubmit={handleAdd}>
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
                                <Dialog 
                                    open={editingDestId === destination._id.toString()} 
                                    onOpenChange={(open) => setEditingDestId(open ? destination._id.toString() : null)}
                                >
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
                                        <form ref={editFormRef} onSubmit={(e) => handleUpdate(e, destination._id.toString())}>
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

export default DestinationsTable