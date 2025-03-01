import { z } from 'zod'

export const ImageSubmissionFormSchema = z.object({
  latitude: z.string().transform(Number),
  longitude: z.string().transform(Number),
  description: z.string(),
  takenAt: z.string().transform((val) => new Date(val)),
  locationName: z.string(),
})

export type ImageSubmissionForm = z.infer<typeof ImageSubmissionFormSchema>

export const ErrorResponseBody = z.object({
  error: z.string().optional(),
})
