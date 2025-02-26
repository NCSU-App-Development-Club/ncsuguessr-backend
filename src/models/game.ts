import { z } from 'zod'

// NOTE: this must be kept in sync with game table definition
export const GameRow = z.object({
  id: z.number(),
  imageId: z.number(),
  date: z.date(),
  plays: z.number(),
  totalDist: z.number(),
})

export type GameRowType = z.infer<typeof GameRow>
