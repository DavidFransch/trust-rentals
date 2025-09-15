"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabaseClient"

interface DashboardNavProps {
  userRole?: "landlord" | "renter" | null
}

export function DashboardNav({ userRole }: DashboardNavProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/auth")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">Trust Rentals</span>
            </div>
            <div className="ml-6 flex space-x-8">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
              >
                Dashboard
              </Link>
              {userRole === "landlord" && (
                <Link
                  href="/dashboard/property-management"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                >
                  Manage Properties
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <Button variant="ghost" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </nav>
    </header>
  )
}
