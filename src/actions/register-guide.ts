"use server"

import { connectDB } from "@/lib/mongodb";
import Guide from "@/models/guide"
import bcrypt from "bcryptjs";

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

    const savedGuide = await guide.save();

    return {
      name: savedGuide.name,
      email: savedGuide.email,
      location: savedGuide.location,
      languages: savedGuide.languages,
      experience: savedGuide.experience,
      specialties: savedGuide.specialties,
      status: savedGuide.status,
      createdAt: savedGuide.createdAt,
      updatedAt: savedGuide.updatedAt,
    }

  } catch (e) {
    console.error("Error registering guide:", e);
    return {
      error: 'An error occurred while registering the guide. Please try again later.'
    }
  }
}