"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { searchUsersAction, createGroup } from "@/lib/api"
import type { User } from "@/lib/kv-store"
import { useLanguage } from "@/lib/language-context"

interface CreateGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
}

export function CreateGroupDialog({ open, onOpenChange, userId }: CreateGroupDialogProps) {
  const { t } = useLanguage()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [memberSearch, setMemberSearch] = useState("")
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [selectedMembers, setSelectedMembers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSearchUsers = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    const results = await searchUsersAction(query, userId)
    setSearchResults(results)
  }

  const addMember = (member: User) => {
    if (!selectedMembers.find((m) => m.id === member.id)) {
      setSelectedMembers([...selectedMembers, member])
    }
    setMemberSearch("")
    setSearchResults([])
  }

  const removeMember = (memberId: string) => {
    setSelectedMembers(selectedMembers.filter((m) => m.id !== memberId))
  }

  const handleCreate = async () => {
    if (!name) return

    setIsLoading(true)

    try {
      await createGroup(
        name,
        userId,
        selectedMembers.map((m) => m.id),
      )

      setName("")
      setDescription("")
      setSelectedMembers([])
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error("Error creating group:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t.createNewGroup}</DialogTitle>
          <DialogDescription>{t.createGroupDesc}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">{t.groupName}</Label>
            <Input id="name" placeholder="Weekend Trip" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">{t.descriptionOptional}</Label>
            <Textarea
              id="description"
              placeholder="Expenses for our weekend getaway"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="members">{t.addMembers}</Label>
            <Input
              id="members"
              placeholder={t.searchByEmailUsername}
              value={memberSearch}
              onChange={(e) => {
                setMemberSearch(e.target.value)
                handleSearchUsers(e.target.value)
              }}
            />
            {searchResults.length > 0 && (
              <div className="rounded-lg border border-border bg-card">
                {searchResults.map((user) => (
                  <button
                    key={user.id}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-accent"
                    onClick={() => addMember(user)}
                  >
                    <div className="font-medium text-card-foreground">{user.name}</div>
                    <div className="text-muted-foreground">@{user.username}</div>
                  </button>
                ))}
              </div>
            )}
            {selectedMembers.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                  >
                    {member.name}
                    <button onClick={() => removeMember(member.id)} className="ml-1 hover:text-primary/80">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t.cancel}
          </Button>
          <Button onClick={handleCreate} disabled={isLoading || !name}>
            {isLoading ? t.creating : t.createGroupButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
