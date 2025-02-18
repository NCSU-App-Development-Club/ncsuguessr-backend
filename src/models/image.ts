import { z } from 'zod'

export const ImageRow = z.object({
  id: z.number(),
  fileLocation: z.string().max(30),
  latitude: z.number(),
  longitude: z.number(),
  description: z.string(),
  takenAt: z.date(),
  validated: z.boolean(),
  locationName: z.string(),
})

export type ImageRowType = z.infer<typeof ImageRow>

export const NewImage = ImageRow.omit({ id: true })

export type NewImageType = z.infer<typeof NewImage>
