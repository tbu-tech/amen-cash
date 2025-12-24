"use client"

import { useState, useEffect } from "react"
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
import { getGroupMembers, createExpense } from "@/lib/api"
import { useRouter } from "next/navigation"
import type { User } from "@/lib/store"
import { useLanguage } from "@/lib/language-context"

interface AddExpenseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  groupId: string
  userId: string
}

export function AddExpenseDialog({ open, onOpenChange, groupId, userId }: AddExpenseDialogProps) {
  const { t } = useLanguage()
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [members, setMembers] = useState<User[]>([])
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (open && groupId) {
      loadGroupMembers()
    }
  }, [open, groupId])

  const loadGroupMembers = async () => {
    const membersList = await getGroupMembers(groupId)
    setMembers(membersList as User[])
    // Select all members by default
    setSelectedMembers(new Set(membersList.map((m) => m.id)))
  }

  const toggleMember = (memberId: string) => {
    const newSelected = new Set(selectedMembers)
    if (newSelected.has(memberId)) {
      newSelected.delete(memberId)
    } else {
      newSelected.add(memberId)
    }
    setSelectedMembers(newSelected)
  }

  const handleAddExpense = async () => {
    if (!description || !amount || selectedMembers.size === 0) return

    setIsLoading(true)

    try {
      const totalAmount = Number.parseFloat(amount)

      await createExpense(groupId, description, totalAmount, userId, Array.from(selectedMembers))

      setDescription("")
      setAmount("")
      setSelectedMembers(new Set())
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error("Error adding expense:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t.addExpenseTitle}</DialogTitle>
          <DialogDescription>{t.addExpenseDesc}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="description">{t.descriptionLabel}</Label>
            <Input
              id="description"
              placeholder="Dinner at restaurant"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">{t.amount} ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="50.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>{t.splitBetween}</Label>
            <div className="space-y-2">
              {members.map((member) => (
                <label
                  key={member.id}
                  className="flex items-center gap-2 rounded-lg border border-border p-3 cursor-pointer hover:bg-accent"
                >
                  <input
                    type="checkbox"
                    checked={selectedMembers.has(member.id)}
                    onChange={() => toggleMember(member.id)}
                    className="h-4 w-4 text-primary"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{member.name}</div>
                    <div className="text-sm text-muted-foreground">@{member.username}</div>
                  </div>
                  {selectedMembers.has(member.id) && amount && (
                    <div className="text-sm font-medium text-primary">
                      ${(Number.parseFloat(amount) / selectedMembers.size).toFixed(2)}
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t.cancel}
          </Button>
          <Button
            onClick={handleAddExpense}
            disabled={isLoading || !description || !amount || selectedMembers.size === 0}
          >
            {isLoading ? t.adding : t.addExpenseButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
