import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyPlaceholder } from "@/components/dashboard"
import { formatRelativeTime } from "@/lib/utils"

interface Profile {
  id: string
  name: string | null
  avatar_url: string | null
}

interface Review {
  id: string
  rating: number
  text: string
  created_at: string
  profiles: {
    id: string
    name: string | null
    avatar_url: string | null
  }
}

export default async function PropertyPage({ params }: { params: { id: string }}) {
  const {id: propertyId} = params;
  const supabase = createServerComponentClient({cookies});

  // Fetch property details
  const { data: property } = await supabase
    .from("properties")
    .select("*")
    .eq("id", propertyId)
    .single()

  if (!property) {
    return <div className="container mx-auto p-8">Property not found</div>
  }

  // Fetch reviews for this property
  const { data: reviews } = await supabase
    .from('reviews')
    .select(`
      id,
      rating,
      text,
      created_at,
      profiles!reviewer_id (
        id,
        name,
        avatar_url
      )
    `)
    .eq("property_id", propertyId)
    .order('created_at', { ascending: false })
    .then(({ data }) => ({ data: data as unknown as Review[] }))

  return (
    <div className="container mx-auto p-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{property.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video relative mb-4">
            <img
              src={property.image_url || "/placeholder.png"}
              alt={property.title}
              className="rounded-lg object-cover w-full h-full"
            />
          </div>
          <p className="text-gray-600 mb-2">{property.address}</p>
          <p className="text-gray-700">{property.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews && reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border rounded-lg p-4 bg-white shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div>
                      <p className="font-medium">
                        {review.profiles?.name || "Anonymous"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatRelativeTime(review.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="text-gray-700">{review.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyPlaceholder
              message="No reviews yet"
              icon={
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
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

