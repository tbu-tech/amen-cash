"use server"

import { cookies } from "next/headers"

// Simplified API for server actions - just handles cookies
// All actual data is stored client-side

export async function login(email: string, password: string) {
  // Validation happens client-side, we just set the cookie
  const cookieStore = await cookies()
  cookieStore.set("amen_cash_session", "active", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })

  return { success: true }
}

export async function signup(email: string, username: string, name: string, password: string) {
  // User creation happens client-side, we just set the cookie
  const cookieStore = await cookies()
  cookieStore.set("amen_cash_session", "active", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })

  return { success: true }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("amen_cash_session")
}

export async function checkAuth() {
  const cookieStore = await cookies()
  const session = cookieStore.get("amen_cash_session")
  return !!session
}
