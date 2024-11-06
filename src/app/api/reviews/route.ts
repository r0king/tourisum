import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from "@/lib/mongodb"
import Review from "@/models/review"

export async function GET(request: NextRequest) {
  await connectDB()

  const searchParams = request.nextUrl.searchParams
  const itemId = searchParams.get('itemId')
  const itemType = searchParams.get('itemType')

  if (!itemId || !itemType) {
    return NextResponse.json({ error: 'Missing itemId or itemType' }, { status: 400 })
  }

  try {
    const reviews = await Review.find({ itemId, itemType })
      .sort({ createdAt: -1 })
      .populate('username')
      .lean()
    console.log(reviews);
    
    return NextResponse.json({ reviews })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}