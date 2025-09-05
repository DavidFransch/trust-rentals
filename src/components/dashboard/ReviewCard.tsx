"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface ReviewCardProps {
  review: {
    id: string
    property_id: string
    rating: number
    text: string
    created_at: string
    reviewer_name?: string
    property_title?: string
  }
}

export function ReviewCard({ review }: ReviewCardProps) {
  const router = useRouter()

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  return (
    <Card 
      onClick={() => router.push(`/property/${review.property_id}`)}
      className="cursor-pointer hover:shadow-md transition-shadow"
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h4 className="font-medium text-gray-900">{review.reviewer_name}</h4>
            {review.property_title && (
              <h5 className="text-sm text-gray-600">{review.property_title}</h5>
            )}
            <div className="flex items-center space-x-1">
              {renderStars(review.rating)}
            </div>
          </div>
          <span className="text-sm text-gray-500">{review.created_at}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-gray-700 text-sm leading-relaxed">{review.text}</p>
      </CardContent>
    </Card>
  )
}
