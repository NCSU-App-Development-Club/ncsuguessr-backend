import { z } from "zod"
let nextGameId = 1
// Mock database types and storage
type Game = {
    id: number
    imageId: number
    date: Date
    plays: number
    totalDist: number
  }
  
  type Image = {
    id: number
    fileLocation: string
    validated: boolean
  }
  
  // Mock storage
  const games: Game[] = []
  const images: Image[] = []
  
  // Validation schemas
  const CreateGameSchema = z.object({
    imageId: z.number(),
    date: z.string().transform(val => new Date(val))
  })
  
  // Add some mock data
  images.push({
    id: 1,
    fileLocation: 'mock-location-1',
    validated: true
  })
  
  games.push({
    id: nextGameId++,
    imageId: 1,
    date: new Date('2024-03-20'),
    plays: 0,
    totalDist: 0
  })
  
   nextGameId = 1
  
 export { games, images }