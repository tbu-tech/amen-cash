"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, getUserGroups } from "@/lib/client-store"
import type { User, Group } from "@/lib/client-store"
import { DashboardContent } from "@/components/dashboard-content"
import { checkAuth } from "@/lib/api"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const isAuthenticated = await checkAuth()
      if (!isAuthenticated) {
        router.push("/auth/login")
        return
      }

      const currentUser = getCurrentUser()
      if (!currentUser) {
        router.push("/auth/login")
        return
      }

      setUser(currentUser)
      setGroups(getUserGroups(currentUser.id))
      setLoading(false)
    }

    loadData()
  }, [router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <DashboardContent user={user} groups={groups} />
}
