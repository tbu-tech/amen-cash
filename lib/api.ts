"use server"

import { cookies } from "next/headers"
import {
  initializeKV,
  findUserByEmailOrUsername,
  createUser as kvCreateUser,
  getUserGroups,
  createGroup as kvCreateGroup,
  createExpense as kvCreateExpense,
  searchUsers as kvSearchUsers,
  getGroupById,
  getGroupMembers,
  getGroupExpenses,
  payExpense as kvPayExpense,
  cancelExpense as kvCancelExpense,
  calculateGroupBalances,
} from "@/lib/kv-store"
import type { User, Group, Expense } from "@/lib/kv-store"

// Initialize KV on first load
initializeKV()

// Auth operations
export async function login(
  email: string,
  password: string,
): Promise<{ success: boolean; user?: User; error?: string }> {
  const user = await findUserByEmailOrUsername(email)

  if (!user || user.password !== password) {
    return { success: false, error: "Invalid email or password" }
  }

  const cookieStore = await cookies()
  cookieStore.set("amen_cash_user_id", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  })

  return { success: true, user }
}

export async function signup(
  email: string,
  username: string,
  name: string,
  password: string,
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const user = await kvCreateUser(email, username, name, password)

    const cookieStore = await cookies()
    cookieStore.set("amen_cash_user_id", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })

    return { success: true, user }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "An error occurred" }
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("amen_cash_user_id")
}

export async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies()
  const userId = cookieStore.get("amen_cash_user_id")
  return userId?.value || null
}

// Group operations
export async function createGroup(
  name: string,
  userId: string,
  memberIds: string[],
): Promise<{ success: boolean; group?: Group; error?: string }> {
  try {
    const group = await kvCreateGroup(name, userId, memberIds)
    return { success: true, group }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "An error occurred" }
  }
}

export async function getGroups(userId: string): Promise<Group[]> {
  return await getUserGroups(userId)
}

export async function getGroup(groupId: string): Promise<Group | undefined> {
  return await getGroupById(groupId)
}

export async function getMembers(groupId: string): Promise<User[]> {
  return await getGroupMembers(groupId)
}

// Expense operations
export async function createExpense(
  groupId: string,
  description: string,
  amount: number,
  paidBy: string,
  splitWith: string[],
): Promise<{ success: boolean; expense?: Expense; error?: string }> {
  try {
    const expense = await kvCreateExpense(groupId, description, amount, paidBy, splitWith)
    return { success: true, expense }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "An error occurred" }
  }
}

export async function getExpenses(groupId: string): Promise<Expense[]> {
  return await getGroupExpenses(groupId)
}

export async function payExpenseAction(
  expenseId: string,
  userId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await kvPayExpense(expenseId, userId)
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "An error occurred" }
  }
}

export async function cancelExpenseAction(expenseId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await kvCancelExpense(expenseId)
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "An error occurred" }
  }
}

export async function getBalances(groupId: string): Promise<Map<string, number>> {
  return await calculateGroupBalances(groupId)
}

// User operations
export async function searchUsersAction(query: string, excludeUserId: string): Promise<User[]> {
  return await kvSearchUsers(query, excludeUserId)
}
