import { z } from 'zod'

// TODO: zod-based DTOs for any routes that return JSON data

export const ImageSubmissionSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  description: z.string(),
  takenAt: z.date(),
  locationName: z.string(),
})

export type ImageSubmission = z.infer<typeof ImageSubmissionSchema>
