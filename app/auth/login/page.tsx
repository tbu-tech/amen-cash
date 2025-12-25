"use client"

import type React from "react"

import { login } from "@/lib/api"
import { findUserByEmailOrUsername, setCurrentUser } from "@/lib/client-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DollarSign } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function LoginPage() {
  const { t } = useLanguage()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const user = findUserByEmailOrUsername(email)

      if (!user || user.password !== password) {
        throw new Error(t.invalidCredentials || "Invalid email or password")
      }

      // Store current user client-side
      setCurrentUser(user)

      // Set server-side session cookie
      await login(email, password)

      router.push("/dashboard")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-white to-secondary p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <DollarSign className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">{t.appName}</h1>
          <LanguageSwitcher />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{t.welcomeBack}</CardTitle>
            <CardDescription>{t.enterCredentials}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">{t.emailOrUsername}</Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="you@example.com or username"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">{t.password}</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t.loggingIn : t.login}
                </Button>
                <div className="rounded-lg bg-primary/5 p-3 text-sm text-muted-foreground">
                  <strong>{t.demo}:</strong> alice@example.com / password123
                </div>
              </div>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                {t.dontHaveAccount}{" "}
                <Link href="/auth/sign-up" className="font-medium text-primary hover:underline">
                  {t.signUp}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
