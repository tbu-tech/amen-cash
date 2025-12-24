// Simple in-memory data store
export type User = {
  id: string
  email: string
  username: string
  name: string
  password: string
  createdAt: Date
}

export type Group = {
  id: string
  name: string
  members: string[]
  createdBy: string
  createdAt: Date
}

export type Expense = {
  id: string
  groupId: string
  description: string
  amount: number
  paidBy: string
  splitWith: string[]
  status: "pending" | "paid" | "cancelled"
  payments: { userId: string; amount: number; paidAt: Date }[]
  createdAt: Date
}

// In-memory storage
const users = new Map<string, User>()
const groups = new Map<string, Group>()
const expenses = new Map<string, Expense>()
const sessions = new Map<string, string>() // sessionId -> userId

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 15)

// User operations
export const createUser = (email: string, username: string, name: string, password: string): User => {
  // Check if user already exists
  for (const user of users.values()) {
    if (user.email === email || user.username === username) {
      throw new Error("User already exists")
    }
  }

  const user: User = {
    id: generateId(),
    email,
    username,
    name,
    password,
    createdAt: new Date(),
  }
  users.set(user.id, user)
  return user
}

export const findUserByEmail = (email: string): User | undefined => {
  for (const user of users.values()) {
    if (user.email === email) return user
  }
  return undefined
}

export const findUserByUsername = (username: string): User | undefined => {
  for (const user of users.values()) {
    if (user.username === username) return user
  }
  return undefined
}

export const findUserByEmailOrUsername = (identifier: string): User | undefined => {
  return findUserByEmail(identifier) || findUserByUsername(identifier)
}

export const getUserById = (id: string): User | undefined => {
  return users.get(id)
}

export const getAllUsers = (): User[] => {
  return Array.from(users.values())
}

// Session operations
export const createSession = (userId: string): string => {
  const sessionId = generateId()
  sessions.set(sessionId, userId)
  return sessionId
}

export const getSessionUser = (sessionId: string): User | undefined => {
  const userId = sessions.get(sessionId)
  return userId ? users.get(userId) : undefined
}

export const deleteSession = (sessionId: string): void => {
  sessions.delete(sessionId)
}

// Group operations
export const createGroup = (name: string, createdBy: string): Group => {
  const group: Group = {
    id: generateId(),
    name,
    members: [createdBy],
    createdBy,
    createdAt: new Date(),
  }
  groups.set(group.id, group)
  return group
}

export const addGroupMember = (groupId: string, userId: string): void => {
  const group = groups.get(groupId)
  if (group && !group.members.includes(userId)) {
    group.members.push(userId)
  }
}

export const getUserGroups = (userId: string): Group[] => {
  return Array.from(groups.values()).filter((group) => group.members.includes(userId))
}

export const getGroupById = (id: string): Group | undefined => {
  return groups.get(id)
}

// Expense operations
export const createExpense = (
  groupId: string,
  description: string,
  amount: number,
  paidBy: string,
  splitWith: string[],
): Expense => {
  const expense: Expense = {
    id: generateId(),
    groupId,
    description,
    amount,
    paidBy,
    splitWith,
    status: "pending",
    payments: [],
    createdAt: new Date(),
  }
  expenses.set(expense.id, expense)
  return expense
}

export const getGroupExpenses = (groupId: string): Expense[] => {
  return Array.from(expenses.values()).filter((expense) => expense.groupId === groupId)
}

export const payExpense = (expenseId: string, userId: string): void => {
  const expense = expenses.get(expenseId)
  if (!expense || expense.status !== "pending") return

  const sharePerPerson = expense.amount / expense.splitWith.length

  // Record the payment
  expense.payments.push({
    userId,
    amount: sharePerPerson,
    paidAt: new Date(),
  })

  // Check if all members have paid
  const paidUserIds = new Set(expense.payments.map((p) => p.userId))
  const allPaid = expense.splitWith.every((memberId) => memberId === expense.paidBy || paidUserIds.has(memberId))

  if (allPaid) {
    expense.status = "paid"
  }
}

export const cancelExpense = (expenseId: string): void => {
  const expense = expenses.get(expenseId)
  if (!expense || expense.status !== "pending") return

  expense.status = "cancelled"
}

export const getExpenseById = (id: string): Expense | undefined => {
  return expenses.get(id)
}

// Calculate balances for a group
export const calculateGroupBalances = (groupId: string): Map<string, number> => {
  const balances = new Map<string, number>()
  const groupExpenses = getGroupExpenses(groupId).filter((e) => e.status === "pending")

  for (const expense of groupExpenses) {
    const sharePerPerson = expense.amount / expense.splitWith.length

    // Add to payer's balance
    const payerBalance = balances.get(expense.paidBy) || 0
    balances.set(expense.paidBy, payerBalance + expense.amount)

    // Subtract from each person's balance
    for (const userId of expense.splitWith) {
      const userBalance = balances.get(userId) || 0
      balances.set(userId, userBalance - sharePerPerson)
    }
  }

  return balances
}

// Seed some demo data
const seedData = () => {
  // Create demo users
  const alice = createUser("alice@example.com", "alice", "Alice Johnson", "password123")
  const bob = createUser("bob@example.com", "bob", "Bob Smith", "password123")

  console.log("[v0] Demo data seeded: alice@example.com and bob@example.com (password: password123)")
}

seedData()
