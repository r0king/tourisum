'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
// import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Star } from 'lucide-react'
import { submitReview } from '@/actions/submit-review'

interface ReviewModalProps {
    itemId: string
    itemType: 'destination' | 'foodSpot' | 'hotel'
    itemName: string
    districtId: string
}

export function ReviewModal({ itemId, itemType, itemName, districtId }: ReviewModalProps) {
    const [rating, setRating] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()

    const handleSubmit = async (formData: FormData) => {
        const result = await submitReview(formData)
        
        if (result.success) {
            setIsOpen(false)
            router.refresh()
        } else {
            alert(result.error)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Write a Review</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Review {itemName}</DialogTitle>
                </DialogHeader>
                <form action={handleSubmit} className="space-y-4">
                    <input type="hidden" name="itemId" value={itemId} />
                    <input type="hidden" name="itemType" value={itemType} />
                    <input type="hidden" name="districtId" value={districtId} />
                    <div>
                        <Label htmlFor="rating">Rating</Label>
                        <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`cursor-pointer ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                    onClick={() => setRating(star)}
                                />
                            ))}
                        </div>
                        <input type="hidden" name="rating" value={rating} />
                    </div>
                    <div>
                        <Label htmlFor="comment">Comment</Label>
                        <Textarea id="comment" minLength={10} name="comment" placeholder="Write your review here" required />
                    </div>
                    <Button type="submit" className="w-full">Submit Review</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}