'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import HomePage from "@/components/home-page"

export default function Home() {
  const { status } = useSession()
  const router = useRouter()

  return (
    <HomePage 
      authStatus={status} 
      router={router}
    />
  )
}