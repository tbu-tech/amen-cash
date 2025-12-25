// Client-side storage using localStorage
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

// Storage keys
const USERS_KEY = "amen_cash_users"
const GROUPS_KEY = "amen_cash_groups"
const EXPENSES_KEY = "amen_cash_expenses"
const CURRENT_USER_KEY = "amen_cash_current_user"

// Initialize storage with demo data if empty
const initializeStorage = () => {
  if (typeof window === "undefined") return

  const users = getUsers()
  if (users.length === 0) {
    // Create demo users
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
    localStorage.setItem(USERS_KEY, JSON.stringify([alice, bob]))
    console.log("[v0] Demo data seeded: alice@example.com and bob@example.com (password: password123)")
  }
}

// User operations
const getUsers = (): User[] => {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(USERS_KEY)
  return data ? JSON.parse(data) : []
}

const saveUsers = (users: User[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export const createUser = (email: string, username: string, name: string, password: string): User => {
  const users = getUsers()

  // Check if user already exists
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
  saveUsers(users)
  return user
}

export const findUserByEmailOrUsername = (identifier: string): User | undefined => {
  const users = getUsers()
  return users.find((u) => u.email === identifier || u.username === identifier)
}

export const getUserById = (id: string): User | undefined => {
  const users = getUsers()
  return users.find((u) => u.id === id)
}

export const getAllUsers = (): User[] => {
  return getUsers()
}

export const searchUsers = (query: string, excludeUserId: string): User[] => {
  const users = getUsers()
  return users
    .filter(
      (user) =>
        user.id !== excludeUserId &&
        (user.email.toLowerCase().includes(query.toLowerCase()) ||
          user.username.toLowerCase().includes(query.toLowerCase())),
    )
    .slice(0, 5)
}

// Current user operations
export const setCurrentUser = (user: User) => {
  if (typeof window === "undefined") return
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
}

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null
  const data = localStorage.getItem(CURRENT_USER_KEY)
  return data ? JSON.parse(data) : null
}

export const clearCurrentUser = () => {
  if (typeof window === "undefined") return
  localStorage.removeItem(CURRENT_USER_KEY)
}

// Group operations
const getGroups = (): Group[] => {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(GROUPS_KEY)
  return data ? JSON.parse(data) : []
}

const saveGroups = (groups: Group[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem(GROUPS_KEY, JSON.stringify(groups))
}

export const createGroup = (name: string, createdBy: string, memberIds: string[]): Group => {
  const groups = getGroups()
  const allMembers = [createdBy, ...memberIds.filter((id) => id !== createdBy)]

  const group: Group = {
    id: generateId(),
    name,
    members: allMembers,
    createdBy,
    createdAt: new Date().toISOString(),
  }

  groups.push(group)
  saveGroups(groups)
  return group
}

export const getUserGroups = (userId: string): Group[] => {
  const groups = getGroups()
  return groups.filter((group) => group.members.includes(userId))
}

export const getGroupById = (id: string): Group | undefined => {
  const groups = getGroups()
  return groups.find((g) => g.id === id)
}

export const getGroupMembers = (groupId: string): User[] => {
  const group = getGroupById(groupId)
  if (!group) return []

  return group.members.map((memberId) => getUserById(memberId)).filter((u) => u !== undefined) as User[]
}

// Expense operations
const getExpenses = (): Expense[] => {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(EXPENSES_KEY)
  return data ? JSON.parse(data) : []
}

const saveExpenses = (expenses: Expense[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses))
}

export const createExpense = (
  groupId: string,
  description: string,
  amount: number,
  paidBy: string,
  splitWith: string[],
): Expense => {
  const expenses = getExpenses()

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
  saveExpenses(expenses)
  return expense
}

export const getGroupExpenses = (groupId: string): Expense[] => {
  const expenses = getExpenses()
  return expenses.filter((expense) => expense.groupId === groupId)
}

export const payExpense = (expenseId: string, userId: string): void => {
  const expenses = getExpenses()
  const expense = expenses.find((e) => e.id === expenseId)
  if (!expense || expense.status !== "pending") return

  const sharePerPerson = expense.amount / expense.splitWith.length

  // Record the payment
  expense.payments.push({
    userId,
    amount: sharePerPerson,
    paidAt: new Date().toISOString(),
  })

  // Check if all members have paid
  const paidUserIds = new Set(expense.payments.map((p) => p.userId))
  const allPaid = expense.splitWith.every((memberId) => memberId === expense.paidBy || paidUserIds.has(memberId))

  if (allPaid) {
    expense.status = "paid"
  }

  saveExpenses(expenses)
}

export const cancelExpense = (expenseId: string): void => {
  const expenses = getExpenses()
  const expense = expenses.find((e) => e.id === expenseId)
  if (!expense || expense.status !== "pending") return

  expense.status = "cancelled"
  saveExpenses(expenses)
}

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

// Initialize on load
if (typeof window !== "undefined") {
  initializeStorage()
}
