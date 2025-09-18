"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { DashboardNav, LoadingSpinner, ReviewCard } from "@/components/dashboard"
import { ReviewForm } from "@/components/review-form"

interface Property {
  id: string
  title: string
  address: string
  image_url?: string
  owner_id: string
}

interface Review {
  id: string
  property_id: string
  reviewer_id: string
  rating: number
  text: string
  created_at: string
  reviewer_name?: string
}

interface ReviewFormValues {
  rating: number
  text: string
}

export default function PropertyPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id: propertyId } = useParams<{ id: string }>()

  const [property, setProperty] = useState<Property | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null)
  const [reviewToEdit, setReviewToEdit] = useState<Review | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  // Fetch user session and property details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
          router.push("/auth")
          return
        }
        setUserId(user.id)

        const { data: propertyData, error: propertyError } = await supabase
          .from("properties")
          .select("*")
          .eq("id", propertyId)
          .single()

        if (propertyError || !propertyData) {
          console.error("Error fetching property:", propertyError)
          router.push("/dashboard")
          return
        }

        setProperty(propertyData)
      } catch (error) {
        console.error("Error fetching property or session:", error)
        router.push("/dashboard")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [propertyId, router])

  // Fetch reviews whenever the property is set
  useEffect(() => {
    if (!property) return

    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select(`
            *,
            profiles:reviewer_id (name)
          `)
          .eq("property_id", property.id)
          .order("created_at", { ascending: false })

        if (error) throw error

        const reviewsWithNames = (data || []).map((review: any) => ({
          id: review.id,
          property_id: review.property_id,
          reviewer_id: review.reviewer_id,
          rating: review.rating,
          text: review.text,
          created_at: review.created_at,
          reviewer_name: review.profiles?.name ?? "Anonymous",
        }))

        setReviews(reviewsWithNames)
      } catch (error) {
        console.error("Error fetching reviews:", error)
      }
    }

    fetchReviews()
  }, [property])

  const handleCreateReview = async (data: ReviewFormValues) => {
    if (!userId || !property) return
    setIsSaving(true)
    try {
      const { error } = await supabase.from("reviews").insert([{
        property_id: property.id,
        reviewer_id: userId,
        rating: data.rating,
        text: data.text,
      }])

      if (error) throw error

      // Refresh reviews
      const updatedReviews = await supabase
        .from("reviews")
        .select(`*, profiles:reviewer_id(name)`)
        .eq("property_id", property.id)
        .order("created_at", { ascending: false })

      setReviews((updatedReviews.data || []).map((r: any) => ({
        ...r,
        reviewer_name: r.profiles?.name ?? "Anonymous"
      })))
      setIsModalOpen(false)
    } catch (error) {
      console.error("Error creating review:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId)
      if (error) throw error
      setReviews(prev => prev.filter(r => r.id !== reviewId))
      setReviewToDelete(null)
    } catch (error) {
      console.error("Error deleting review:", error)
    }
  }

  const handleEditReview = async (data: ReviewFormValues) => {
    if (!reviewToEdit || !property) return
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ rating: data.rating, text: data.text })
        .eq("id", reviewToEdit.id)
      if (error) throw error

      // Refresh reviews
      const { data: refreshedReviews } = await supabase
        .from("reviews")
        .select(`*, profiles:reviewer_id(name)`)
        .eq("property_id", property.id)
        .order("created_at", { ascending: false })

      setReviews((refreshedReviews || []).map((r: any) => ({
        ...r,
        reviewer_name: r.profiles?.name ?? "Anonymous"
      })))
      setReviewToEdit(null)
    } catch (error) {
      console.error("Error updating review:", error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || !property) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner message="Loading property details..." />
      </div>
    )
  }

  return (
    <>
      <DashboardNav />
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
          <p className="text-gray-600 mb-4">{property.address}</p>

          {property.image_url && (
            <div className="aspect-video relative rounded-lg overflow-hidden mb-8">
              <img src={property.image_url} alt={property.title} className="object-cover w-full h-full" />
            </div>
          )}

          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Reviews</CardTitle>
              <Button onClick={() => setIsModalOpen(true)}>Write a Review</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviews.map(review => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onEdit={userId === review.reviewer_id ? () => setReviewToEdit(review) : undefined}
                  onDelete={userId === review.reviewer_id ? () => setReviewToDelete(review) : undefined}
                />
              ))}
            </CardContent>
          </Card>

          {/* Create Review Modal */}
          <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <AlertDialogContent className="sm:max-w-[500px]">
              <AlertDialogHeader className="flex justify-between items-center">
                <AlertDialogTitle>Write a Review</AlertDialogTitle>
                <AlertDialogCancel asChild>
                  <Button variant="ghost">✕</Button>
                </AlertDialogCancel>
              </AlertDialogHeader>
              <div className="py-4">
                <ReviewForm onSubmit={handleCreateReview} isLoading={isSaving} />
              </div>
            </AlertDialogContent>
          </AlertDialog>

          {/* Edit Review Modal */}
          <AlertDialog open={!!reviewToEdit} onOpenChange={() => setReviewToEdit(null)}>
            <AlertDialogContent className="sm:max-w-[500px]">
              <AlertDialogHeader className="flex justify-between items-center">
                <AlertDialogTitle>Edit Review</AlertDialogTitle>
                <AlertDialogCancel asChild>
                  <Button variant="ghost">✕</Button>
                </AlertDialogCancel>
              </AlertDialogHeader>
              <div className="py-4">
                <ReviewForm
                  initialData={reviewToEdit ? { rating: reviewToEdit.rating, text: reviewToEdit.text } : undefined}
                  onSubmit={handleEditReview}
                  isLoading={isSaving}
                />
              </div>
            </AlertDialogContent>
          </AlertDialog>

          {/* Delete Review Modal */}
          <AlertDialog open={!!reviewToDelete} onOpenChange={() => setReviewToDelete(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Review</AlertDialogTitle>
              </AlertDialogHeader>
              <p className="py-4">Are you sure you want to delete this review? This action cannot be undone.</p>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => reviewToDelete && handleDeleteReview(reviewToDelete.id)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </main>
      </div>
    </>
  )
}