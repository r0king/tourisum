import mongoose, { Schema, Document } from 'mongoose';

interface IDestination {
    name: string;
    type: string;
    description: string;
    imageUrl: string;
    averageRating: number;
    reviewCount: number;
    status: 'pending' | 'approved' | 'rejected';
}

interface IFoodSpot {
    name: string;
    cuisine: string;
    description: string;
    location: string;
    averageRating: number;
    reviewCount: number;
    status: 'pending' | 'approved' | 'rejected';
}

interface IEvent {
    name: string;
    date: Date;
    description: string;
    location: string;
    status: 'pending' | 'approved' | 'rejected';
}

interface IDistrict extends Document {
    name: string;
    description: string;
    destinations: IDestination[];
    foodSpots: IFoodSpot[];
    events: IEvent[];
}

const DestinationSchema = new Schema({
    name: String,
    type: String,
    description: String,
    imageUrl: String,
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
});

const FoodSpotSchema = new Schema({
    name: String,
    cuisine: String,
    description: String,
    location: String,
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
});

const EventSchema = new Schema({
    name: String,
    date: Date,
    description: String,
    location: String,
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
});

const DistrictSchema = new Schema<IDistrict>({
    name: { type: String, required: true, unique: true },
    description: String,
    destinations: [DestinationSchema],
    foodSpots: [FoodSpotSchema],
    events: [EventSchema],
});

const District = mongoose.models?.District || mongoose.model<IDistrict>('District', DistrictSchema);
export default District;
