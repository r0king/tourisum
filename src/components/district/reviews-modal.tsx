'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Star } from 'lucide-react'

interface Review {
    _id: string
    rating: number
    comment: string
    createdAt: string
    username: string
}

interface ReviewsModalProps {
    itemId: string
    itemType: 'destination' | 'foodSpot' | 'hotel'
    itemName: string
    children: React.ReactNode
}

export function ReviewsModal({ children, itemId, itemType, itemName }: ReviewsModalProps) {
    const [reviews, setReviews] = useState<Review[]>([])
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`/api/reviews?itemId=${itemId}&itemType=${itemType}`)
                if (response.ok) {
                    const data = await response.json()
                    setReviews(data.reviews)
                } else {
                    console.error('Failed to fetch reviews')
                }
            } catch (error) {
                console.error('Error fetching reviews:', error)
            }
        }

        if (isOpen) {
            fetchReviews()
        }
    }, [isOpen, itemId, itemType])


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild className='cursor-pointer'>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Reviews for {itemName}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {reviews.length === 0 ? (
                        <p>No reviews yet.</p>
                    ) : (
                        reviews.map((review) => (
                            <div key={review._id} className="border-b pb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-semibold">{review.username}</span>
                                    <div className="flex items-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-1">{review.comment}</p>
                                <p className="text-xs text-gray-400">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}