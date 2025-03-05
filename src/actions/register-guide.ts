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
  about: string,
  idType: string,
  googleDriveUrl: string
}) => {
  const { name, email, password, phone, location, languages, experience, specialties, about, idType, googleDriveUrl } = values;

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
      idType,
      googleDriveUrl,
      status: 'pending'
    });

    await guide.save();

    await sendEmail('CONFIRMATION', email, { 
      userName: name,
      bookingId: 'GUIDE_SIGNUP',
      date: new Date().toDateString() 
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