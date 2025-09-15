import * as z from "zod"

export const propertyFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  address: z.string().min(1, "Address is required"),
  description: z.string().optional(),
  image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
})

export type PropertyFormValues = z.infer<typeof propertyFormSchema>