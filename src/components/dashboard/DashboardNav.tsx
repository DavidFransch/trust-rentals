"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabaseClient"

interface NavLink {
  label: string
  href: string
}

interface DashboardNavProps {
  links?: NavLink[]
}

export function DashboardNav({ links = [] }: DashboardNavProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/auth")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const defaultLinks: NavLink[] = [
    { label: "Profile Setup", href: "/profile-setup" },
    { label: "Waitlist", href: "/waitlist" },
  ]

  const allLinks = [...links, ...defaultLinks]

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl font-semibold text-gray-900">Trust Rentals</h1>
          <nav className="flex items-center space-x-4">
            {allLinks.map((link) => (
              <Button
                key={link.href}
                variant="ghost"
                onClick={() => router.push(link.href)}
              >
                {link.label}
              </Button>
            ))}
            <Button variant="ghost" onClick={handleSignOut}>
              Logout
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
