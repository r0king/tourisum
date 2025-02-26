"use server"

import { connectDB } from "@/lib/mongodb";
import Guide from "@/models/guide"
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { sendEmail } from '@/app/actions/send-email';

export const registerGuide = async (values: {
  name: string,
  email: string,
  password: string,
  phone: string,
  location: string,
  languages: string[],
  experience: number,
  specialties: string[],
  about: string
}) => {
  const { name, email, password, phone, location, languages, experience, specialties, about } = values;

  try {
    await connectDB();

    const guideFound = await Guide.findOne({ email });
    if (guideFound) {
      return {
        error: 'A guide with this email already exists!'
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const guide = new Guide({
      name,
      email,
      password: hashedPassword,
      phone,
      location,
      languages,
      experience,
      specialties,
      about,
      status: 'pending'
    });

    await guide.save();

    // Send guide signup confirmation email
    await sendEmail('CONFIRMATION', email, { // Using 'CONFIRMATION' template, adjust if needed
      userName: name,
      bookingId: 'GUIDE_SIGNUP', // Placeholder, adjust as needed
      date: new Date().toDateString() // Signup date
    });

  } catch (e) {
    console.error("Error registering guide:", e);
    return {
      error: 'An error occurred while registering the guide. Please try again later.'
    }
  }
  finally {

    redirect("/login");
  }
}