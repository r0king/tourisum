import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IDestination {   
    _id: Types.ObjectId;
    name: string;
    type: string;
    description: string;
    imageUrl: string;
    averageRating: number;
    reviewCount: number;
    status: 'pending' | 'approved' | 'rejected';
}

export interface IFoodSpot {
    _id: Types.ObjectId;
    name: string;
    cuisine: string;
    description: string;
    location: string;
    averageRating: number;
    reviewCount: number;
    status: 'pending' | 'approved' | 'rejected';
}

export interface IEvent {
    _id: Types.ObjectId;
    name: string;
    date: Date;
    description: string;
    location: string;
    status: 'pending' | 'approved' | 'rejected';
}
interface IHotel {
    name: string;
    description: string;
    location: string;
    price: number;
    averageRating: number;
    reviewCount: number;
    status: 'pending' | 'approved' | 'rejected';
}

export interface IDistrict extends Document {
    name: string;
    description: string;
    destinations: IDestination[];
    foodSpots: IFoodSpot[];
    events: IEvent[];
    hotels: IHotel[];
    pincode: string;
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

const HotelSchema = new Schema<IHotel>({
    name: { type: String, required: true },
    description: String,
    location: { type: String, required: true },
    price: { type: Number, required: true },
    averageRating: { type: Number, min: 0, max: 5, default: 0 },
    reviewCount: { type: Number, default: 0 },
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
    hotels: [HotelSchema],
    pincode: String,
});

const District = mongoose.models?.District || mongoose.model<IDistrict>('District', DistrictSchema);
export default District;
