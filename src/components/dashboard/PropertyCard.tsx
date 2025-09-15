"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface PropertyCardProps {
  title: string
  address: string
  imageUrl?: string
  onEdit?: () => void
  onDelete?: () => void
  onClick?: () => void
}

export function PropertyCard({ 
  title, 
  address, 
  imageUrl, 
  onEdit, 
  onDelete,
  onClick 
}: PropertyCardProps) {
  return (
    <Card 
      className={`overflow-hidden transition-shadow hover:shadow-md ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
    >
      <CardHeader className="p-0">
        {imageUrl ? (
          <div className="relative h-48 w-full">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
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
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2">{address}</p>
        
        {(onEdit || onDelete) && (
          <div className="flex gap-2 mt-4">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit()
                }}
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="w-full text-xs text-gray-500">
          Click to view details
        </div>
      </CardFooter>
    </Card>
  )
}
