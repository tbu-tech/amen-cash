import { redirect } from "next/navigation"
import { getCurrentUser, getUserGroups } from "@/lib/api"
import { DashboardContent } from "@/components/dashboard-content"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  const groups = await getUserGroups(user.id)

  return <DashboardContent user={user} groups={groups} />
}
