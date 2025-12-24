"use client"

import { Button } from "@/components/ui/button"
import { DollarSign, Users, PieChart, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function LandingPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <DollarSign className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">{t.appName}</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button variant="ghost" asChild>
              <Link href="/auth/login">{t.login}</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">{t.signUp}</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-5xl font-bold leading-tight text-balance text-foreground md:text-6xl">
            {t.heroTitle}
          </h1>
          <p className="mb-8 text-xl text-muted-foreground text-pretty">{t.heroDescription}</p>
          <Button size="lg" className="gap-2" asChild>
            <Link href="/auth/sign-up">
              {t.getStartedFree} <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>

        {/* Features */}
        <div className="mx-auto mt-24 grid max-w-5xl gap-8 md:grid-cols-3">
          <div className="rounded-lg bg-card p-6 shadow-sm border border-border">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-card-foreground">{t.easyGroupManagement}</h3>
            <p className="text-muted-foreground">{t.easyGroupManagementDesc}</p>
          </div>

          <div className="rounded-lg bg-card p-6 shadow-sm border border-border">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-card-foreground">{t.smartExpenseSplitting}</h3>
            <p className="text-muted-foreground">{t.smartExpenseSplittingDesc}</p>
          </div>

          <div className="rounded-lg bg-card p-6 shadow-sm border border-border">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <PieChart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-card-foreground">{t.clearBalanceOverview}</h3>
            <p className="text-muted-foreground">{t.clearBalanceOverviewDesc}</p>
          </div>
        </div>
      </main>
    </div>
  )
}
