"use client"

import React, { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import WaitlistForm from "./components/WaitlistForm"

export default function LandingPage() {
  const waitlistRef = useRef<HTMLDivElement | null>(null)

  const scrollToWaitlist = () => {
    waitlistRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

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
                Trust Rentals makes renting transparent and stress-free. Discover verified properties, share trustworthy reviews, and manage everything in one modern experience.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" onClick={scrollToWaitlist} className="px-6">
                  Join the Waitlist
                </Button>
                <Button size="lg" variant="outline" onClick={scrollToWaitlist} className="px-6">
                  Learn More
                </Button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">No spam. Unsubscribe anytime.</p>
            </div>

            <div className="relative">
              <div className="aspect-square sm:aspect-video w-full rounded-2xl bg-gradient-to-tr from-primary/10 via-primary/5 to-transparent border shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Everything you need to rent with confidence</h2>
            <p className="mt-3 text-muted-foreground">Designed for modern renters and landlords with a focus on trust, clarity, and speed.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Verified reviews",
                desc: "Real insights from real renters to help you choose wisely.",
              },
              {
                title: "Property management",
                desc: "Landlords manage listings, reviews, and details effortlessly.",
              },
              {
                title: "Secure accounts",
                desc: "Supabase Auth with best practices for safety and privacy.",
              },
              {
                title: "Fast search",
                desc: "Find the right place quickly with filters that matter.",
              },
              {
                title: "Modern UI",
                desc: "Clean, accessible interfaces that feel premium yet familiar.",
              },
              {
                title: "Seamless onboarding",
                desc: "Get started in minutes whether you rent or manage.",
              },
            ].map((f) => (
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

      {/* Social Proof */}
      <section className="py-16 sm:py-20 bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {["\"Trust Rentals made my move stress-free.\"", "\"As a landlord, reviews help me improve.\"", "\"Finally, transparency in renting.\""]
              .map((quote, i) => (
                <Card key={i} className="h-full">
                  <CardContent className="p-6">
                    <p className="text-base leading-relaxed">{quote}</p>
                    <p className="mt-3 text-xs text-muted-foreground">Early user</p>
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
            <p className="mt-3 text-muted-foreground">Join the waitlist and get early access when we launch.</p>
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
            <p>© {new Date().getFullYear()} Trust Rentals</p>
            <nav className="flex items-center gap-6">
              <a href="#" className="hover:text-foreground">About</a>
              <a href="#" className="hover:text-foreground">Contact</a>
              <a href="#" className="hover:text-foreground">Privacy</a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}


