import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
    user: mongoose.Types.ObjectId;
    username: string;
    rating: number;
    comment: string;
    itemType: 'foodSpot' | 'destination' | 'guide' | 'hotel';
    itemId: mongoose.Types.ObjectId;
    districtId?: mongoose.Types.ObjectId;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        minlength: 10
    },
    itemType: {
        type: String,
        enum: ['foodSpot', 'destination', 'guide', 'hotel'],
        required: true
    },
    itemId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    districtId: {
        type: Schema.Types.ObjectId,
        ref: 'District'
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, {
    timestamps: true
});

const Review = mongoose.models?.Review || mongoose.model<IReview>('Review', ReviewSchema);
export default Review;
