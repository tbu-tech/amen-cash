import { kv } from "@vercel/kv"

export type User = {
  id: string
  email: string
  username: string
  name: string
  password: string
  createdAt: string
}

export type Group = {
  id: string
  name: string
  members: string[]
  createdBy: string
  createdAt: string
}

export type Expense = {
  id: string
  groupId: string
  description: string
  amount: number
  paidBy: string
  splitWith: string[]
  status: "pending" | "paid" | "cancelled"
  payments: { userId: string; amount: number; paidAt: string }[]
  createdAt: string
}

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 15)

// Redis keys
const USERS_KEY = "amen_cash:users"
const GROUPS_KEY = "amen_cash:groups"
const EXPENSES_KEY = "amen_cash:expenses"

// Initialize with demo data
export const initializeKV = async () => {
  const users = await kv.get<User[]>(USERS_KEY)
  if (!users || users.length === 0) {
    const alice: User = {
      id: generateId(),
      email: "alice@example.com",
      username: "alice",
      name: "Alice Johnson",
      password: "password123",
      createdAt: new Date().toISOString(),
    }
    const bob: User = {
      id: generateId(),
      email: "bob@example.com",
      username: "bob",
      name: "Bob Smith",
      password: "password123",
      createdAt: new Date().toISOString(),
    }
    await kv.set(USERS_KEY, [alice, bob])
    await kv.set(GROUPS_KEY, [])
    await kv.set(EXPENSES_KEY, [])
  }
}

// User operations
export const createUser = async (email: string, username: string, name: string, password: string): Promise<User> => {
  const users = (await kv.get<User[]>(USERS_KEY)) || []

  if (users.some((u) => u.email === email || u.username === username)) {
    throw new Error("User already exists")
  }

  const user: User = {
    id: generateId(),
    email,
    username,
    name,
    password,
    createdAt: new Date().toISOString(),
  }

  users.push(user)
  await kv.set(USERS_KEY, users)
  return user
}

export const findUserByEmailOrUsername = async (identifier: string): Promise<User | undefined> => {
  const users = (await kv.get<User[]>(USERS_KEY)) || []
  return users.find((u) => u.email === identifier || u.username === identifier)
}

export const getUserById = async (id: string): Promise<User | undefined> => {
  const users = (await kv.get<User[]>(USERS_KEY)) || []
  return users.find((u) => u.id === id)
}

export const searchUsers = async (query: string, excludeUserId: string): Promise<User[]> => {
  const users = (await kv.get<User[]>(USERS_KEY)) || []
  return users
    .filter(
      (user) =>
        user.id !== excludeUserId &&
        (user.email.toLowerCase().includes(query.toLowerCase()) ||
          user.username.toLowerCase().includes(query.toLowerCase())),
    )
    .slice(0, 5)
}

// Group operations
export const createGroup = async (name: string, createdBy: string, memberIds: string[]): Promise<Group> => {
  const groups = (await kv.get<Group[]>(GROUPS_KEY)) || []
  const allMembers = [createdBy, ...memberIds.filter((id) => id !== createdBy)]

  const group: Group = {
    id: generateId(),
    name,
    members: allMembers,
    createdBy,
    createdAt: new Date().toISOString(),
  }

  groups.push(group)
  await kv.set(GROUPS_KEY, groups)
  return group
}

export const getUserGroups = async (userId: string): Promise<Group[]> => {
  const groups = (await kv.get<Group[]>(GROUPS_KEY)) || []
  return groups.filter((group) => group.members.includes(userId))
}

export const getGroupById = async (id: string): Promise<Group | undefined> => {
  const groups = (await kv.get<Group[]>(GROUPS_KEY)) || []
  return groups.find((g) => g.id === id)
}

export const getGroupMembers = async (groupId: string): Promise<User[]> => {
  const group = await getGroupById(groupId)
  if (!group) return []

  const users = (await kv.get<User[]>(USERS_KEY)) || []
  return group.members.map((memberId) => users.find((u) => u.id === memberId)).filter((u) => u !== undefined) as User[]
}

// Expense operations
export const createExpense = async (
  groupId: string,
  description: string,
  amount: number,
  paidBy: string,
  splitWith: string[],
): Promise<Expense> => {
  const expenses = (await kv.get<Expense[]>(EXPENSES_KEY)) || []

  const expense: Expense = {
    id: generateId(),
    groupId,
    description,
    amount,
    paidBy,
    splitWith,
    status: "pending",
    payments: [],
    createdAt: new Date().toISOString(),
  }

  expenses.push(expense)
  await kv.set(EXPENSES_KEY, expenses)
  return expense
}

export const getGroupExpenses = async (groupId: string): Promise<Expense[]> => {
  const expenses = (await kv.get<Expense[]>(EXPENSES_KEY)) || []
  return expenses.filter((expense) => expense.groupId === groupId)
}

export const payExpense = async (expenseId: string, userId: string): Promise<void> => {
  const expenses = (await kv.get<Expense[]>(EXPENSES_KEY)) || []
  const expense = expenses.find((e) => e.id === expenseId)
  if (!expense || expense.status !== "pending") return

  const sharePerPerson = expense.amount / expense.splitWith.length

  expense.payments.push({
    userId,
    amount: sharePerPerson,
    paidAt: new Date().toISOString(),
  })

  const paidUserIds = new Set(expense.payments.map((p) => p.userId))
  const allPaid = expense.splitWith.every((memberId) => memberId === expense.paidBy || paidUserIds.has(memberId))

  if (allPaid) {
    expense.status = "paid"
  }

  await kv.set(EXPENSES_KEY, expenses)
}

export const cancelExpense = async (expenseId: string): Promise<void> => {
  const expenses = (await kv.get<Expense[]>(EXPENSES_KEY)) || []
  const expense = expenses.find((e) => e.id === expenseId)
  if (!expense || expense.status !== "pending") return

  expense.status = "cancelled"
  await kv.set(EXPENSES_KEY, expenses)
}

export const deleteGroup = async (groupId: string): Promise<boolean> => {
  const expenses = (await kv.get<Expense[]>(EXPENSES_KEY)) || []
  const groupExpenses = expenses.filter((e) => e.groupId === groupId)

  // Check if all expenses are settled (paid or cancelled)
  const hasUnpaidExpenses = groupExpenses.some((e) => e.status === "pending")
  if (hasUnpaidExpenses) {
    return false // Cannot delete group with pending expenses
  }

  // Remove the group
  const groups = (await kv.get<Group[]>(GROUPS_KEY)) || []
  const filteredGroups = groups.filter((g) => g.id !== groupId)
  await kv.set(GROUPS_KEY, filteredGroups)

  // Remove all expenses for this group
  const filteredExpenses = expenses.filter((e) => e.groupId !== groupId)
  await kv.set(EXPENSES_KEY, filteredExpenses)

  return true
}

export const calculateGroupBalances = async (groupId: string): Promise<Map<string, number>> => {
  const balances = new Map<string, number>()
  const groupExpenses = (await getGroupExpenses(groupId)).filter((e) => e.status === "pending")

  for (const expense of groupExpenses) {
    const sharePerPerson = expense.amount / expense.splitWith.length

    const payerBalance = balances.get(expense.paidBy) || 0
    balances.set(expense.paidBy, payerBalance + expense.amount)

    for (const userId of expense.splitWith) {
      const userBalance = balances.get(userId) || 0
      balances.set(userId, userBalance - sharePerPerson)
    }
  }

  return balances
}
