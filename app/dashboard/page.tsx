"use client"

import { redirect } from "next/navigation"
import { getCurrentUserId, getGroups } from "@/lib/api"
import { getUserById } from "@/lib/kv-store"
import { DashboardContent } from "@/components/dashboard-content"

export default async function DashboardPage() {
  const userId = await getCurrentUserId()

  if (!userId) {
    redirect("/auth/login")
  }

  const user = await getUserById(userId)

  if (!user) {
    redirect("/auth/login")
  }

  const groups = await getGroups(userId)

  return <DashboardContent user={user} groups={groups} />
}
