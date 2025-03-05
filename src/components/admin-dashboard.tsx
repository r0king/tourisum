'use client'

import React from 'react'
import { Edit, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { getPendingGuides, getAllApprovedGuides, approveGuide, updateGuideStatus, updateGuideInfo, deleteGuide } from '@/actions/guide-actions'
import { useTransition } from 'react'
import { IGuide } from '@/models/guide'
import { sendEmail } from '@/app/actions/send-email';
import { getDashboardStats } from '@/actions/dashboard-actions'
import { DashBoardOverView } from './admin-dashboard/dashboard-overview'
import { DistrictsManagement } from './admin-dashboard/districts-management'
import { getAllDistricts } from '@/actions/district-actions'
import GuideAssignmentTab from './admin-dashboard/guide-assignment-tab'

interface AdminDashboardProps {
    stats: Awaited<ReturnType<typeof getDashboardStats>>;
    initialPendingGuides: IGuide[];
    initialAllGuides: IGuide[];
    initialDistricts: Awaited<ReturnType<typeof getAllDistricts>>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
    stats: dashboardStats,
    initialPendingGuides,
    initialAllGuides,
    initialDistricts,
}) => {
    const [pendingGuides, setPendingGuides] = React.useState(initialPendingGuides)
    const [allGuides, setAllGuides] = React.useState(initialAllGuides)
    const [isPending, startTransition] = useTransition()

    const handleApproveGuide = (guideId: string) => {
        startTransition(async () => {
            await approveGuide(guideId)
            const updatedPending = await getPendingGuides()
            const updatedAll = await getAllApprovedGuides()
            setPendingGuides(updatedPending);
            setAllGuides(updatedAll);

            // Send guide approval email
            const guide = pendingGuides.find(g => g._id.toString() === guideId);
            if (guide) {
                await sendEmail('CONFIRMATION', guide.email, { // Assuming 'CONFIRMATION' template is suitable, or create a new one
                    userName: guide.name,
                    bookingId: 'GUIDE_APPROVAL', // Placeholder, adjust as needed
                    date: new Date().toDateString() // Approval date
                });
            }
        })
    }

    const handleUpdateGuideStatus = (guideId: string, status: 'active' | 'inactive') => {
        startTransition(async () => {
            await updateGuideStatus(guideId, status)
            const updatedAll = await getAllApprovedGuides()
            setAllGuides(updatedAll)
        })
    }

    const handleUpdateGuideInfo = async (guideId: string, guideData: Partial<IGuide>) => {
        startTransition(async () => {
            await updateGuideInfo(guideId, guideData)
            const updatedAll = await getAllApprovedGuides()
            setAllGuides(updatedAll)
        })
    }

    const handleDeleteGuide = (guideId: string) => {
        startTransition(async () => {
            await deleteGuide(guideId)
            const updatedAll = await getAllApprovedGuides()
            setAllGuides(updatedAll)
        })
    }

    return (
        <div className="flex h-screen bg-background">

            {/* Main content */}
            <main className="flex-1 p-8 overflow-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold">Welcome, Admin</h2>
                </div>

                <Tabs defaultValue="overview">
                    <TabsList className="mb-4 bg-primary text-primary-foreground">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="guides">Guides</TabsTrigger>
                        <TabsTrigger value="districts">Districts</TabsTrigger>
                        <TabsTrigger value="guide-assignment">Guide Assignment</TabsTrigger>
                    </TabsList>

                    <TabsContent value="guide-assignment">
                        <GuideAssignmentTab />
                    </TabsContent>

                    <TabsContent value="overview">
                        {dashboardStats && (
                            <DashBoardOverView {...dashboardStats} />
                        )}
                    </TabsContent>

                    <TabsContent value="guides">
                        <PendingGuides pendingGuides={pendingGuides} handleApproveGuide={handleApproveGuide} isPending={isPending} />
                        <AllGuides allGuides={allGuides} handleUpdateGuideStatus={handleUpdateGuideStatus} handleUpdateGuideInfo={handleUpdateGuideInfo} handleDeleteGuide={handleDeleteGuide} />
                    </TabsContent>


                    <TabsContent value="districts">
                        <DistrictsManagement initialDistricts={initialDistricts} />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}

export default AdminDashboard;

function AllGuides({ allGuides, handleUpdateGuideStatus, handleUpdateGuideInfo, handleDeleteGuide }: { allGuides: IGuide[], handleUpdateGuideStatus: (guideId: string, status: "active" | "inactive") => void, handleUpdateGuideInfo: (guideId: string, guideData: Partial<IGuide>) => Promise<void>, handleDeleteGuide: (guideId: string) => void }) {
    return <Card>
        <CardHeader>
            <CardTitle>All Guides</CardTitle>
            <CardDescription>Manage all registered guides</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                        <TableHead>ID Type</TableHead>
                        <TableHead>Google Drive URL</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allGuides.map((guide) => (
                        <TableRow key={guide._id.toString()}>
                            <TableCell>{guide.name}</TableCell>
                            <TableCell>{guide.email}</TableCell>
                            <TableCell>{guide.location}</TableCell>
                            <TableCell>{guide.experience} years</TableCell>
                            <TableCell>
                                <Select
                                    value={guide.status}
                                    onValueChange={(value: "active" | "inactive") => handleUpdateGuideStatus(guide._id.toString(), value)}
                                >
                                    <SelectTrigger className="w-[100px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm" className="mr-2">
                                            <Edit className="w-4 h-4 mr-1" /> Edit
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Edit Guide Information</DialogTitle>
                                            <DialogDescription>Update the guide&apos;s details below.</DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                                            e.preventDefault()
                                            const formData = new FormData(e.currentTarget)
                                            const guideData = Object.fromEntries(formData)
                                            handleUpdateGuideInfo(guide._id.toString(), guideData)
                                        }}>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="name" className="text-right">Name</Label>
                                                    <Input id="name" name="name" defaultValue={guide.name} className="col-span-3" />
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="email" className="text-right">Email</Label>
                                                    <Input id="email" name="email" defaultValue={guide.email} className="col-span-3" />
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="location" className="text-right">Location</Label>
                                                    <Input id="location" name="location" defaultValue={guide.location} className="col-span-3" />
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="experience" className="text-right">Experience (years)</Label>
                                                    <Input id="experience" name="experience" type="number" defaultValue={guide.experience} className="col-span-3" />
                                                </div>
                                                {/* New Fields */}
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="idType" className="text-right">ID Type</Label>
                                                    <Input id="idType" name="idType" defaultValue={guide.idType} className="col-span-3" />
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="googleDriveUrl" className="text-right">Google Drive URL</Label>
                                                    <Input id="googleDriveUrl" name="googleDriveUrl" type="url" defaultValue={guide.googleDriveUrl} className="col-span-3" />
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                <Button type="submit">Save changes</Button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteGuide(guide._id.toString())}
                                >
                                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                                </Button>
                            </TableCell>
                            <TableCell>{guide.idType}</TableCell>
                            <TableCell>{guide.googleDriveUrl}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
}

function PendingGuides({ pendingGuides, handleApproveGuide, isPending }: { pendingGuides: IGuide[], handleApproveGuide: (guideId: string) => void, isPending: boolean }) {
    return <Card className="mb-8">
        <CardHeader>
            <CardTitle>Pending Guide Approvals</CardTitle>
            <CardDescription>Review and approve new guide applications</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>ID Type</TableHead>
                        <TableHead>Google Drive URL</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pendingGuides.map((guide: IGuide) => (
                        <TableRow key={guide._id.toString()}>
                            <TableCell>{guide.name}</TableCell>
                            <TableCell>{guide.email}</TableCell>
                            <TableCell>{guide.location}</TableCell>
                            <TableCell>{guide.experience} years</TableCell>
                            <TableCell>
                                <Button
                                    size="sm"
                                    onClick={() => handleApproveGuide(guide._id.toString())}
                                    disabled={isPending}
                                >
                                    {isPending ? 'Approving...' : 'Approve'}
                                </Button>
                            </TableCell>
                            <TableCell>{guide.idType}</TableCell>
                            <TableCell>{guide.googleDriveUrl}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
}
