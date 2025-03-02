import { z } from 'zod'

export const ImageSubmissionForm = z.object({
  latitude: z.string().transform(Number),
  longitude: z.string().transform(Number),
  description: z.string(),
  takenAt: z.string().transform((val) => new Date(val)),
  locationName: z.string(),
})

export type ImageSubmissionFormType = z.infer<typeof ImageSubmissionForm>

export const ErrorResponseBody = z.object({
  error: z.string().optional(),
})

export type ErrorResponseBodyType = z.infer<typeof ErrorResponseBody>
