'use server'

import { revalidatePath } from 'next/cache'
import { connectDB } from "@/lib/mongodb"
import Guide, { IGuide } from "@/models/guide"
import { IBooking } from '@/models/booking';

export async function getPendingGuides() {
  await connectDB()
  const guides = await Guide.find({ status: 'pending' }).select('-password')
  return JSON.parse(JSON.stringify(guides))
}

export async function getAllApprovedGuides() {
  await connectDB()
  const guides = await Guide.find({ status: { $ne: 'pending' } }).select('-password')
  return JSON.parse(JSON.stringify(guides))
}

export async function approveGuide(guideId: string) {
  await connectDB()
  await Guide.findByIdAndUpdate(guideId, { status: 'active' })
  revalidatePath('/admin')
}

export async function updateGuideStatus(guideId: string, status: 'active' | 'inactive') {
  await connectDB()
  await Guide.findByIdAndUpdate(guideId, { status })
  revalidatePath('/admin')
}

export async function updateGuideInfo(guideId: string, guideData: Partial<IGuide>) {
  await connectDB()
  await Guide.findByIdAndUpdate(guideId, guideData)
  revalidatePath('/admin')
}

export async function deleteGuide(guideId: string) {
  await connectDB()
  await Guide.findByIdAndDelete(guideId)
  revalidatePath('/admin')
}

export async function getGuideById(id: string) {
  await connectDB()
  const guide = await Guide.findById(id).select('-password')
  return JSON.parse(JSON.stringify(guide))
}

export async function getAvailableGuides(district: string) {
  await connectDB();
  const guides = await Guide.find({
    location: district,
    status: 'active'
  }).select('-password');
  return JSON.parse(JSON.stringify(guides));
}