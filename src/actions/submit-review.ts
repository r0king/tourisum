'use server'

import { connectDB } from "@/lib/mongodb"
import Review from "@/models/review"
import District from "@/models/district"
import { revalidatePath } from 'next/cache'

export async function submitReview(formData: FormData) {
    await connectDB()

    const itemId = formData.get('itemId') as string
    const itemType = formData.get('itemType') as 'destination' | 'foodSpot' | 'hotel'
    const rating = Number(formData.get('rating'))
    const comment = formData.get('comment') as string
    const districtId = formData.get('districtId') as string
    
    if (!itemId || !itemType || !rating || !comment || !districtId) {
        return { error: 'Missing required fields' }
    }

    try {
        const newReview = new Review({
            user: '64e3f7d81a5f7d9d2e9e1234',
            username:'test user',
            rating,
            comment,
            itemType,
            itemId,
            districtId,
        })

        await newReview.save()

        // Update the average rating and review count for the item
        const district = await District.findById(districtId)
        if (!district) {
            return { error: 'District not found' }
        }

        const item = district[`${itemType}s`].id(itemId)
        if (!item) {
            return { error: `${itemType} not found` }
        }

        const reviews = await Review.find({ itemId, itemType })
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
        item.averageRating = totalRating / reviews.length
        item.reviewCount = reviews.length

        await district.save()

        revalidatePath(`/district/${district.name}`)

        return { success: true }
    } catch (error) {
        console.error('Error submitting review:', error)
        return { error: 'Failed to submit review' }
    }
}