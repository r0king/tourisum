"use server"
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user"
import bcrypt from "bcryptjs";

export const register = async (values: { email: string, password: string, name: string }) => {
    const { email, password, name } = values;

    try {
        await connectDB();
        const userFound = await User.findOne({ email });
        if (userFound) {
            return {
                error: 'Email already exists!'
            }
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
        });
        const savedUser = await user.save();

        return {
            name: savedUser.name,
            email: savedUser.email,
            createdAt: savedUser.createdAt,
            updatedAt: savedUser.updatedAt,
        }

    } catch (e) {
        console.log(e);
    }
}