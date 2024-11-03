'use server'

// import { revalidatePath } from 'next/cache'
import { connectDB } from "@/lib/mongodb"
import District, { IDistrict } from "@/models/district"
import { revalidatePath } from "next/cache"

export async function getAllDistricts() {
  await connectDB()
  const districts = await District.find({})
  return JSON.parse(JSON.stringify(districts))
}

export async function createDistrict(districtData: Partial<IDistrict>) {
  await connectDB()
  const district = new District(districtData)
  await district.save()
  revalidatePath('/admin')
}

export async function updateDistrict(districtId: string, districtData: Partial<IDistrict>) {
  await connectDB()
  await District.findByIdAndUpdate(districtId, districtData)
  revalidatePath('/admin')
}

export async function deleteDistrict(districtId: string) {
  await connectDB()
  await District.findByIdAndDelete(districtId)
  revalidatePath('/admin')
}

export async function addDestination(districtId: string, destinationData: Partial<IDistrict['destinations'][0]>) {
  await connectDB()
  await District.findByIdAndUpdate(
    districtId,
    { $push: { destinations: destinationData } }
  )
  revalidatePath('/admin')
}
export async function updateDestination(districtId: string, destinationId: string, destinationData: Partial<IDistrict['destinations'][0]>) {
  await connectDB()
  await District.findOneAndUpdate(
    { _id: districtId, "destinations._id": destinationId },
    { $set: { "destinations.$": destinationData } }
  )
  revalidatePath('/admin')
}

export async function deleteDestination(districtId: string, destinationId: string) {
  await connectDB()
  await District.findByIdAndUpdate(
    districtId,
    { $pull: { destinations: { _id: destinationId } } }
  )
  revalidatePath('/admin')
}

export async function addFoodSpot(districtId: string, foodSpotData: Partial<IDistrict['foodSpots'][0]>) {
  await connectDB()
  await District.findByIdAndUpdate(
    districtId,
    { $push: { foodSpots: foodSpotData } }
  )
  revalidatePath('/admin')
}
export async function updateFoodSpot(districtId: string, foodSpotId: string, foodSpotData: Partial<IDistrict['foodSpots'][0]>) {
  await connectDB()
  await District.findOneAndUpdate(
    { _id: districtId, "foodSpots._id": foodSpotId },
    { $set: { "foodSpots.$": foodSpotData } }
  )
  revalidatePath('/admin')
}

export async function deleteFoodSpot(districtId: string, foodSpotId: string) {
  await connectDB()
  await District.findByIdAndUpdate(
    districtId,
    { $pull: { foodSpots: { _id: foodSpotId } } }
  )
  revalidatePath('/admin')
}

export async function addEvent(districtId: string, eventData: Partial<IDistrict['events'][0]>) {
  await connectDB()
  await District.findByIdAndUpdate(
    districtId,
    { $push: { events: eventData } }
  )
  revalidatePath('/admin')
}
export async function updateEvent(districtId: string, eventId: string, eventData: Partial<IDistrict['events'][0]>) {
  await connectDB()
  await District.findOneAndUpdate(
    { _id: districtId, "events._id": eventId },
    { $set: { "events.$": eventData } }
  )
  revalidatePath('/admin')
}

export async function deleteEvent(districtId: string, eventId: string) {
  await connectDB()
  await District.findByIdAndUpdate(
    districtId,
    { $pull: { events: { _id: eventId } } }
  )
  revalidatePath('/admin')
}