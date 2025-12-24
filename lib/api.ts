"use server"

import { cookies } from "next/headers"
import * as store from "./store"

// API functions for server actions

export async function login(email: string, password: string) {
  const user = store.findUserByEmailOrUsername(email)

  if (!user || user.password !== password) {
    throw new Error("Invalid email or password")
  }

  const sessionId = store.createSession(user.id)
  const cookieStore = await cookies()
  cookieStore.set("session", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })

  return { success: true }
}

export async function signup(email: string, username: string, name: string, password: string) {
  try {
    const user = store.createUser(email, username, name, password)
    const sessionId = store.createSession(user.id)
    const cookieStore = await cookies()
    cookieStore.set("session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    return { success: true }
  } catch (error) {
    throw error
  }
}

export async function logout() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("session")?.value
  if (sessionId) {
    store.deleteSession(sessionId)
  }
  cookieStore.delete("session")
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("session")?.value
  if (!sessionId) return null

  return store.getSessionUser(sessionId)
}

export async function searchUsers(query: string, excludeUserId: string) {
  const allUsers = store.getAllUsers()
  return allUsers
    .filter(
      (user) =>
        user.id !== excludeUserId &&
        (user.email.toLowerCase().includes(query.toLowerCase()) ||
          user.username.toLowerCase().includes(query.toLowerCase())),
    )
    .slice(0, 5)
}

export async function createGroup(name: string, description: string, createdBy: string, memberIds: string[]) {
  const group = store.createGroup(name, createdBy)
  // Add additional members
  for (const memberId of memberIds) {
    store.addGroupMember(group.id, memberId)
  }
  return group
}

export async function getUserGroups(userId: string) {
  return store.getUserGroups(userId)
}

export async function getGroupMembers(groupId: string) {
  const group = store.getGroupById(groupId)
  if (!group) return []

  return group.members.map((memberId) => store.getUserById(memberId)).filter((u) => u !== undefined)
}

export async function createExpense(
  groupId: string,
  description: string,
  amount: number,
  paidBy: string,
  splitWith: string[],
) {
  return store.createExpense(groupId, description, amount, paidBy, splitWith)
}

export async function getGroupExpenses(groupId: string) {
  return store.getGroupExpenses(groupId)
}

export async function payExpense(expenseId: string, userId: string) {
  store.payExpense(expenseId, userId)
  return { success: true }
}

export async function cancelExpense(expenseId: string) {
  store.cancelExpense(expenseId)
  return { success: true }
}

export async function getGroupBalances(groupId: string) {
  const balances = store.calculateGroupBalances(groupId)
  return Array.from(balances.entries()).map(([userId, balance]) => ({
    userId,
    balance,
  }))
}
