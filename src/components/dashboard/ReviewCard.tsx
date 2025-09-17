"use client"

import { useRouter } from "next/navigation"
import { Review } from "@/types/review"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatRelativeTime } from "@/lib/utils"

interface ReviewCardProps {
  review: Review
  onEdit?: () => void
  onDelete?: () => void
}

export function ReviewCard({ review, onEdit, onDelete }: ReviewCardProps) {
  const router = useRouter()

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`h-4 w-4 ${index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
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
      <CardHeader className="pb-3 space-y-2">
        <div className="flex flex-col space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900 truncate">
              {review.reviewer_name}
            </span>
            <span className="text-xs text-gray-500 flex-shrink-0">
              {formatRelativeTime(review.created_at)}
            </span>
          </div>
          {review.property_title && (
            <span className="text-sm text-gray-600 truncate">
              {review.property_title}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1">
          {renderStars(review.rating)}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
          {review.text}
        </p>
      </CardContent>
      <div className="flex justify-end p-4 space-x-2">
        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
          >
            Edit
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-destructive hover:text-destructive"
          >
            Delete
          </Button>
        )}
      </div>
    </Card>
  )
}