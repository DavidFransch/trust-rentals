export interface Review {
  id: string
  property_id: string
  reviewer_id: string
  rating: number
  text: string
  created_at: string
  reviewer_name?: string
  property_title?: string
}