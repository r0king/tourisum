import mongoose, { Schema, Document } from 'mongoose';

export interface IGuide extends Document {
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
}
const GuideSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    languages: { type: [String], required: true },
    experience: { type: Number, required: true },
    specialties: { type: [String], required: true },
    about: { type: String, required: true },
    status: { type: String, enum: ['pending', 'active', 'inactive'], default: 'pending' },
});

export default mongoose.models.Guide || mongoose.model<IGuide>('Guide', GuideSchema);