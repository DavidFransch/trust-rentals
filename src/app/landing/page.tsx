"use client"

import React, { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import WaitlistForm from "./components/WaitlistForm"
import { supabase } from "@/lib/supabaseClient"

export default function LandingPage() {
  const waitlistRef = useRef<HTMLDivElement | null>(null)
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null)

  const scrollToWaitlist = () => {
    waitlistRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase.from("waitlist").select("id", { count: "exact", head: true })
      setWaitlistCount(count ?? null)
    }
    fetchCount()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/40">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 backdrop-blur px-3 py-1 text-xs text-muted-foreground shadow-sm">
                Built for renters and landlords
              </div>
              <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight">
                Rent Smarter. Rent Safer. Together.
              </h1>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-prose">
                A single platform to find properties, manage listings, and build trust through reviews.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" className="px-6 transition-transform will-change-transform hover:-translate-y-0.5 hover:shadow-md" asChild>
                  <Link href="/dashboard">Find Rentals</Link>
                </Button>
                <Button size="lg" variant="secondary" className="px-6 transition-transform will-change-transform hover:-translate-y-0.5 hover:shadow-md" asChild>
                  <Link href="/dashboard/property-management">Manage Properties</Link>
                </Button>
                <Button size="lg" variant="outline" onClick={scrollToWaitlist} className="px-6 transition-transform will-change-transform hover:-translate-y-0.5">
                  Join Waitlist
                </Button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">No spam. Unsubscribe anytime.</p>
            </div>

            <div className="relative">
              <div className="aspect-square sm:aspect-video w-full rounded-2xl border shadow-lg overflow-hidden">
                <img src="/globe.svg" alt="Illustration of renters and landlords connecting" className="w-full h-full object-cover opacity-90" />
              </div>
              <div className="pointer-events-none absolute -top-10 -right-10 size-40 rounded-full bg-primary/10 blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Everything you need to rent with confidence</h2>
            <p className="mt-3 text-muted-foreground">Benefit-focused features that showcase our competitive edge for both renters and landlords.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Verified Reviews", desc: "Real renter feedback ensures you make informed decisions.", icon: (
                  <svg viewBox="0 0 24 24" className="size-6 text-primary" aria-hidden>
                    <path fill="currentColor" d="M12 2a10 10 0 1 0 8.66 15.14l2.38.79a.75.75 0 0 0 .95-.95l-.79-2.38A10 10 0 0 0 12 2Zm-1 14l-4-4 1.5-1.5L11 12.5l4.5-4.5L17 9l-6 7z" />
                  </svg>)
              },
              {
                title: "All-in-One Dashboard", desc: "Manage properties, track reviews, and stay organized effortlessly.", icon: (
                  <svg viewBox="0 0 24 24" className="size-6 text-primary" aria-hidden>
                    <path fill="currentColor" d="M3 4h18v4H3V4Zm0 6h8v10H3V10Zm10 0h8v6h-8v-6Zm0 8h8v2h-8v-2Z" />
                  </svg>)
              },
              {
                title: "Transparent Interactions", desc: "Clear communication tools reduce disputes and build trust.", icon: (
                  <svg viewBox="0 0 24 24" className="size-6 text-primary" aria-hidden>
                    <path fill="currentColor" d="M4 4h16v10H5.17L4 15.17V4Zm0 12h12v2H4v-2Z" />
                  </svg>)
              },
              {
                title: "Fast Property Search", desc: "Quickly find verified listings with filters that matter.", icon: (
                  <svg viewBox="0 0 24 24" className="size-6 text-primary" aria-hidden>
                    <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.5 6.5 0 1 0 14 15.5l.27.28v.79l5 5L20.5 19l-5-5ZM6.5 11A4.5 4.5 0 1 1 11 15.5 4.5 4.5 0 0 1 6.5 11Z" />
                  </svg>)
              },
              {
                title: "Secure & Private", desc: "Your data is protected with best-in-class security.", icon: (
                  <svg viewBox="0 0 24 24" className="size-6 text-primary" aria-hidden>
                    <path fill="currentColor" d="M12 2 6 5v5c0 5.25 3.4 10.74 6 12 2.6-1.26 6-6.75 6-12V5l-6-3Zm0 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" />
                  </svg>)
              },
              {
                title: "Instant Onboarding", desc: "Sign up and start managing or renting in minutes.", icon: (
                  <svg viewBox="0 0 24 24" className="size-6 text-primary" aria-hidden>
                    <path fill="currentColor" d="M12 2a5 5 0 0 1 5 5v2h1a2 2 0 0 1 2 2v9H4V11a2 2 0 0 1 2-2h1V7a5 5 0 0 1 5-5Zm-3 7h6V7a3 3 0 0 0-6 0v2Z" />
                  </svg>)
              },
            ].map((f) => (
              <Card key={f.title} className="h-full transition-transform hover:-translate-y-0.5 hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 rounded-md bg-primary/10 p-2">{f.icon}</div>
                    <div>
                      <h3 className="font-medium text-lg">{f.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 sm:py-20 bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { quote: "Trust Rentals made my move stress-free.", role: "Early Renter", initials: "JR" },
              { quote: "As a landlord, reviews help me improve.", role: "Landlord", initials: "AL" },
              { quote: "Finally, transparency in renting.", role: "Beta Tester", initials: "TK" },
            ].map((item, i) => (
              <Card key={i} className="h-full bg-gradient-to-b from-background to-background/60">
                <CardContent className="p-6 relative">
                  <div className="absolute -top-6 -right-6 size-20 bg-primary/10 rounded-full blur-2xl" />
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-primary/10 text-primary grid place-items-center text-xs font-medium">
                      {item.initials}
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded-full border text-muted-foreground">{item.role}</span>
                  </div>
                  <p className="mt-4 text-base leading-relaxed">“{item.quote}”</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Coming Soon</h2>
            <p className="mt-3 text-muted-foreground">A glimpse at what we're building to make renting even better.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:gap-6 md:grid-cols-3">
            {[{
              title: "Digital Contracts",
              desc: "E-signature integration for easy, secure rental agreements.",
            }, {
              title: "Instant Credit Checks",
              desc: "Screen tenants instantly with trusted credit bureaus.",
            }, {
              title: "AI Recommendations",
              desc: "Personalized suggestions for renters and landlords.",
            }].map((f) => (
              <Card key={f.title} className="h-full">
                <CardContent className="p-6">
                  <h3 className="font-medium text-lg">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section className="py-16 sm:py-24" ref={waitlistRef}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Be first to know</h2>
            <p className="mt-3 text-muted-foreground">Join the waitlist for early access and exclusive features.</p>
            {waitlistCount !== null && (
              <p className="mt-2 text-xs text-primary">{waitlistCount.toLocaleString()} people have already joined</p>
            )}
          </div>
          <div className="mt-8">
            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-6">
              <p>© {new Date().getFullYear()} Trust Rentals</p>
              <div className="hidden sm:flex items-center gap-3">
                <span className="px-2 py-0.5 rounded-full border">Verified Reviews</span>
                <span className="px-2 py-0.5 rounded-full border">Secure</span>
                <span className="px-2 py-0.5 rounded-full border">Fast Onboarding</span>
              </div>
            </div>
            <nav className="flex items-center gap-6">
              <a href="#" className="hover:text-foreground">About</a>
              <a href="#" className="hover:text-foreground">Contact</a>
              <a href="#" className="hover:text-foreground">Privacy</a>
              <div className="flex items-center gap-3">
                <a href="#" aria-label="Twitter" className="hover:text-foreground">Tw</a>
                <a href="#" aria-label="LinkedIn" className="hover:text-foreground">In</a>
              </div>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}


