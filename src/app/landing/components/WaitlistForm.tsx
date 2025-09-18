"use client"

import React, { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

type RoleOption = "renter" | "landlord"

interface WaitlistFormProps {
  className?: string
}

export const WaitlistForm: React.FC<WaitlistFormProps> = ({ className }) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<RoleOption | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setError(null)

    if (!email || !role) {
      setError("Please provide at least your email and select a role.")
      return
    }

    setIsSubmitting(true)
    try {
      const { error: insertError } = await supabase.from("waitlist").insert([
        {
          name: name || null,
          email,
          role,
          created_at: new Date().toISOString(),
        },
      ])
      if (insertError) throw insertError
      setMessage("Thanks for joining! We'll keep you posted.")
      setName("")
      setEmail("")
      setRole(undefined)
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4" aria-label="Join the waitlist">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="role">I am a</Label>
              <Select value={role} onValueChange={(v) => setRole(v as RoleOption)}>
                <SelectTrigger id="role" aria-label="Select your role">
                  <SelectValue placeholder="Choose your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="renter">Renter</SelectItem>
                  <SelectItem value="landlord">Landlord</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {message && (
            <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
              {message}
            </p>
          )}
          {error && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={isSubmitting} className="px-6">
              {isSubmitting ? "Joining..." : "Join the Waitlist"}
            </Button>
            <span className="text-xs text-muted-foreground">No spam. Unsubscribe anytime.</span>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default WaitlistForm


