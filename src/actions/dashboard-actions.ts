'use server'

import { connectDB } from "@/lib/mongodb"
import District, { IDistrict } from "@/models/district"

export async function getDashboardStats(): Promise<{
  totalDistricts: number;
  totalDestinations: number;
  totalFoodSpots: number;
  totalEvents: number;
  pendingDestinations: number;
  pendingFoodSpots: number;
  pendingEvents: number;
  visitorData: { name: string; visitors: number }[];
}> {
  await connectDB()
  
  const districts = await District.find()
  
  const totalDistricts = districts.length
  let totalDestinations = 0
  let totalFoodSpots = 0
  let totalEvents = 0
  let pendingDestinations = 0
  let pendingFoodSpots = 0
  let pendingEvents = 0

  const visitorData: { [key: string]: number } = {}
  const now = new Date()
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1)

  districts.forEach((district: IDistrict) => {
    totalDestinations += district.destinations.length
    totalFoodSpots += district.foodSpots.length
    totalEvents += district.events.length

    pendingDestinations += district.destinations.filter(d => d.status === 'pending').length
    pendingFoodSpots += district.foodSpots.filter(f => f.status === 'pending').length
    pendingEvents += district.events.filter(e => e.status === 'pending').length

    district.events.forEach(event => {
      if (event.date >= sixMonthsAgo && event.date <= now) {
        const monthYear = event.date.toISOString().slice(0, 7)
        visitorData[monthYear] = (visitorData[monthYear] || 0) + 1
      }
    })
  })

  const sortedVisitorData = Object.entries(visitorData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, visitors]) => ({ name, visitors }))

  return {
    totalDistricts,
    totalDestinations,
    totalFoodSpots,
    totalEvents,
    pendingDestinations,
    pendingFoodSpots,
    pendingEvents,
    visitorData: sortedVisitorData
  }
}

export async function approveItem(
  districtName: string, 
  itemType: 'destination' | 'foodSpot' | 'event', 
  itemId: string
): Promise<void> {
  await connectDB()
  
  const updateField = `${itemType}s.$[elem].status`
  const arrayFilters = [{ "elem._id": itemId }]

  await District.updateOne(
    { name: districtName },
    { $set: { [updateField]: 'approved' } },
    { arrayFilters }
  )
}