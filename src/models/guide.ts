import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IGuide extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    phone: string;
    location: string;
    languages: string[];
    experience: number;
    specialties: string[];
    about: string;
    status: 'pending' | 'active' | 'inactive';
    averageRating: number;
    reviewCount: number;
    idType: 'Aadhar' | 'Passport' | 'Voter ID' | 'PAN Card';
    googleDriveUrl: string;
}

const GuideSchema: Schema = new Schema<IGuide>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    languages: { type: [String], required: true },
    experience: { type: Number, required: true },
    specialties: { type: [String], required: true },
    about: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'active', 'inactive'],
        default: 'pending'
    },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    idType: {
        type: String,
        enum: ['Aadhar', 'Passport', 'Voter ID', 'PAN Card'],
        required: true
    },
    googleDriveUrl: { type: String, required: true }
}, {
    timestamps: true
});

const Guide = mongoose.models?.Guide || mongoose.model<IGuide>('Guide', GuideSchema);
export default Guide;
