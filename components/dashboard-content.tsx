"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, Plus, Users, LogOut, Trash2 } from "lucide-react"
import { logout, deleteGroup as deleteGroupAction } from "@/lib/api"
import type { User, Group } from "@/lib/kv-store"
import { useRouter } from "next/navigation"
import { CreateGroupDialog } from "@/components/create-group-dialog"
import { AddExpenseDialog } from "@/components/add-expense-dialog"
import { GroupExpensesView } from "@/components/group-expenses-view"
import { useLanguage } from "@/lib/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DashboardContentProps {
  user: User
  groups: Group[]
}

export function DashboardContent({ user, groups: initialGroups }: DashboardContentProps) {
  const { t } = useLanguage()
  const router = useRouter()
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(initialGroups[0]?.id || null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleLogout = async () => {
    await logout()
    router.push("/")
    router.refresh()
  }

  const handleAddExpense = (groupId: string) => {
    setSelectedGroup(groupId)
    setShowAddExpense(true)
  }

  const handleExpenseAdded = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const handleDeleteGroup = async () => {
    if (!groupToDelete) return

    setIsDeleting(true)
    const result = await deleteGroupAction(groupToDelete)

    if (result.success) {
      // Switch to first available group or null
      const remainingGroups = initialGroups.filter((g) => g.id !== groupToDelete)
      setSelectedGroup(remainingGroups[0]?.id || null)
      setShowDeleteConfirm(false)
      setGroupToDelete(null)
      router.refresh()
    } else {
      alert(result.error || t.cannotDeleteGroup)
    }
    setIsDeleting(false)
  }

  const initiateDelete = (groupId: string) => {
    setGroupToDelete(groupId)
    setShowDeleteConfirm(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <DollarSign className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-card-foreground">{t.appName}</h1>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                {t.logout}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              {t.welcomeBackUser} {user.name}!
            </h2>
            <p className="text-muted-foreground">{t.manageGroupsExpenses}</p>
          </div>
          <Button onClick={() => setShowCreateGroup(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t.createGroup}
          </Button>
        </div>

        {/* Groups Tabs */}
        {initialGroups.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Users className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-semibold text-foreground">{t.noGroupsYet}</h3>
              <p className="mb-4 text-center text-muted-foreground">{t.noGroupsDesc}</p>
              <Button onClick={() => setShowCreateGroup(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {t.createFirstGroup}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs value={selectedGroup || undefined} onValueChange={setSelectedGroup}>
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                {initialGroups.map((group) => (
                  <TabsTrigger key={group.id} value={group.id}>
                    {group.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="flex gap-2">
                {selectedGroup && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => initiateDelete(selectedGroup)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t.deleteGroup}
                    </Button>
                    <Button onClick={() => handleAddExpense(selectedGroup)}>
                      <Plus className="mr-2 h-4 w-4" />
                      {t.addExpense}
                    </Button>
                  </>
                )}
              </div>
            </div>

            {initialGroups.map((group) => (
              <TabsContent key={group.id} value={group.id}>
                <div className="space-y-6">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-semibold mb-1">{group.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {group.members.length} {group.members.length === 1 ? t.member : t.members} • {t.created}{" "}
                        {new Date(group.createdAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>

                  <GroupExpensesView key={`${group.id}-${refreshKey}`} groupId={group.id} userId={user.id} />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </main>

      <CreateGroupDialog open={showCreateGroup} onOpenChange={setShowCreateGroup} userId={user.id} />

      {selectedGroup && (
        <AddExpenseDialog
          open={showAddExpense}
          onOpenChange={setShowAddExpense}
          groupId={selectedGroup}
          userId={user.id}
          onExpenseAdded={handleExpenseAdded}
        />
      )}

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.deleteGroup}</AlertDialogTitle>
            <AlertDialogDescription>{t.deleteGroupConfirm}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteGroup}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? t.pending : t.deleteGroupButton}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
