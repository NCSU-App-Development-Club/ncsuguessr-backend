import { z } from 'zod'

export const GameRow = z.object({
  id: z.number(),
  imageId: z.number(),
  date: z.date(),
  plays: z.number(),
  totalDist: z.number(),
})

export type GameRowType = z.infer<typeof GameRow>
