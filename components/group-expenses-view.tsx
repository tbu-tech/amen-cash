"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getGroupExpenses, getGroupMembers, payExpense, cancelExpense } from "@/lib/client-store"
import type { Expense, User } from "@/lib/client-store"
import { DollarSign, Check, X } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface GroupExpensesViewProps {
  groupId: string
  userId: string
}

export function GroupExpensesView({ groupId, userId }: GroupExpensesViewProps) {
  const { t } = useLanguage()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [members, setMembers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    const expensesData = getGroupExpenses(groupId)
    const membersData = getGroupMembers(groupId)
    setExpenses(expensesData)
    setMembers(membersData)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [groupId])

  const getMemberName = (memberId: string) => {
    const member = members.find((m) => m.id === memberId)
    return member ? member.name : "Unknown"
  }

  const handlePay = async (expenseId: string) => {
    payExpense(expenseId, userId)
    await loadData()
  }

  const handleCancel = async (expenseId: string) => {
    cancelExpense(expenseId)
    await loadData()
  }

  const getAmountOwed = (expense: Expense) => {
    return expense.amount / expense.splitWith.length
  }

  const hasUserPaid = (expense: Expense) => {
    return expense.payments.some((p) => p.userId === userId) || expense.paidBy === userId
  }

  if (loading) {
    return <div className="text-center text-muted-foreground">{t.loadingExpenses}</div>
  }

  const pendingExpenses = expenses.filter((e) => e.status === "pending")
  const settledExpenses = expenses.filter((e) => e.status === "paid" || e.status === "cancelled")

  return (
    <div className="space-y-6">
      {/* Pending Expenses */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">{t.pendingExpenses}</h3>
        {pendingExpenses.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">{t.noPendingExpenses}</CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {pendingExpenses.map((expense) => (
              <Card key={expense.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base">{expense.description}</CardTitle>
                      <CardDescription>
                        {t.paidBy} {getMemberName(expense.paidBy)} • {t.splitBetweenCount} {expense.splitWith.length}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">${expense.amount.toFixed(2)}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      {expense.paidBy === userId ? (
                        <span className="text-muted-foreground">{t.youPaidThis}</span>
                      ) : hasUserPaid(expense) ? (
                        <span className="text-primary font-medium flex items-center gap-1">
                          <Check className="h-4 w-4" />
                          {t.youvePaid} ${getAmountOwed(expense).toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-foreground font-medium">
                          {t.youOwe} ${getAmountOwed(expense).toFixed(2)}
                        </span>
                      )}
                    </div>
                    {expense.paidBy !== userId && !hasUserPaid(expense) && (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handlePay(expense.id)}>
                          <DollarSign className="mr-1 h-4 w-4" />
                          {t.pay}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleCancel(expense.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    {expense.paidBy === userId && (
                      <Button size="sm" variant="outline" onClick={() => handleCancel(expense.id)}>
                        <X className="mr-1 h-4 w-4" />
                        {t.cancel}
                      </Button>
                    )}
                  </div>
                  {/* Show payment progress */}
                  {expense.payments.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">{t.paymentsReceived}</p>
                      <div className="flex flex-wrap gap-2">
                        {expense.payments.map((payment, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {getMemberName(payment.userId)} - ${payment.amount.toFixed(2)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Settled Expenses */}
      {settledExpenses.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-foreground">{t.settledExpenses}</h3>
          <div className="space-y-3">
            {settledExpenses.map((expense) => (
              <Card key={expense.id} className="opacity-60">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base">{expense.description}</CardTitle>
                      <CardDescription>
                        {t.paidBy} {getMemberName(expense.paidBy)}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">${expense.amount.toFixed(2)}</Badge>
                      <Badge variant={expense.status === "paid" ? "default" : "outline"}>
                        {expense.status === "paid" ? t.paid : t.cancelled}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
