import mongoose, { Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
  email: string;
  password: string;
  name: string;
  phone: string;
  image: string;
  role: 'user' | 'admin' | 'moderator';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>({
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Email is invalid"],
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: [true, "Name is required"]
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  phone: String,
  image: String
}, {
  timestamps: true,
});

const User = mongoose.models?.User || mongoose.model<UserDocument>('User', UserSchema);
export default User;
