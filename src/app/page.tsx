'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import HomePage from "@/components/home-page"
import { ExtendedUser } from "@/lib/auth"

export default function Home() {
  const { status, data: session } = useSession()
  const router = useRouter()

  return (
    <HomePage
      authStatus={status}
      router={router}
      user={session?.user as ExtendedUser}
    />
  )
}