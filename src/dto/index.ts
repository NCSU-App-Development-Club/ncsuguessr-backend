import { z } from 'zod'

// TODO: zod-based DTOs for any routes that return JSON data

export const ImageSubmissionSchema = z.object({
  latitude: z.string().transform(Number),
  longitude: z.string().transform(Number),
  description: z.string(),
  takenAt: z.string().transform((val) => new Date(val)),
  locationName: z.string(),
})

export type ImageSubmission = z.infer<typeof ImageSubmissionSchema>
