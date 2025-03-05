"use server"
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user"
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export const register = async (values: { email: string, password: string, name: string }) => {
    const { email, password, name } = values;

    // try {
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
        await user.save();
        redirect('/login');

    // } catch (e) {
    //     console.log("Error signing up: ", email);
    //     throw new Error("Error signing up");
    // } finally {
    // }
}