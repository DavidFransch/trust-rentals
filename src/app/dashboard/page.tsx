"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "@supabase/supabase-js"
import { DashboardNav, LoadingSpinner, EmptyPlaceholder } from "@/components/dashboard"

interface UserProfile {
  id: string
  name: string | null
  role: "renter" | "landlord" | null
  phone: string | null
  bio: string | null
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
         // Redirect to auth if not authenticated
        if (userError || !user) {
          router.push("/auth")
          return
        }

        setUser(user)

        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        if (profileError) {
          console.error("Error fetching profile:", profileError)
        } else {
          setProfile(profileData)
        }
      } catch (error) {
        console.error("Auth check error:", error)
        router.push("/auth")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const getUserDisplayName = () => {
    if (profile?.name) return profile.name
    if (user?.email) return user.email
    return user?.id?.slice(0, 8) || "User"
  }

  const getRoleDisplayName = () => {
    if (!profile?.role) return "No role set"
    return profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading dashboard..." />
      </div>
    )
  }

  const propertyIcon = (
    <svg
      className="h-12 w-12 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <DashboardNav />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {getUserDisplayName()}!
          </h2>
          <p className="text-gray-600">
            Role: <span className="font-medium">{getRoleDisplayName()}</span>
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Properties Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Properties</CardTitle>
                <CardDescription>
                  {profile?.role === "landlord" 
                    ? "Manage your rental properties" 
                    : "Browse available rentals"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EmptyPlaceholder 
                  message="No properties yet"
                  icon={propertyIcon}
                />
                <p className="text-sm text-gray-500 text-center mt-2">
                  {profile?.role === "landlord" 
                    ? "Add your first rental property to get started" 
                    : "Check back soon for available rentals"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push("/profile-setup")}
                >
                  Update Profile
                </Button>
              </CardContent>
            </Card>

            {/* Review Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile?.role === "renter" ? (
                  <Button variant="outline" className="w-full" disabled>
                    Add New Review
                  </Button>
                ) : profile?.role === "landlord" ? (
                  <Button variant="outline" className="w-full" disabled>
                    View Reviews Received
                  </Button>
                ) : (
                  <p className="text-sm text-gray-500">
                    Set your role to access review features
                  </p>
                )}
                <p className="text-xs text-gray-400">
                  Coming soon
                </p>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Properties:</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Reviews:</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Profile:</span>
                    <span className="font-medium">
                      {profile?.name ? "Complete" : "Incomplete"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
