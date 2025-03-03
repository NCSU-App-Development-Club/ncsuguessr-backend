import adminAuth from '../../adminAuth'
import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { z } from 'zod'

const route = new OpenAPIHono()

// Define schemas for request and response
const CreateGameSchema = z.object({
  imageId: z.number(),
  date: z.coerce.date()
})

const GameSchema = z.object({
  id: z.number(),
  imageId: z.number(),
  date: z.date(),
  plays: z.number(),
  totalDist: z.number()
})

// Create game route with OpenAPI
route.openapi(
  createRoute({
    method: 'post',
    path: '/',
    tags: ['games'],
    security: [{ adminAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: CreateGameSchema
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Game created successfully',
        content: {
          'application/json': {
            schema: z.object({
              game: GameSchema
            })
          }
        }
      },
      400: {
        description: 'Invalid request body',
        content: {
          'application/json': {
            schema: z.object({
              error: z.string()
            })
          }
        }
      },
      404: {
        description: 'Image not found',
        content: {
          'application/json': {
            schema: z.object({
              error: z.string()
            })
          }
        }
      },
      500: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: z.object({
              error: z.string()
            })
          }
        }
      }
    }
  }),
  adminAuth,
  async (c) => {
    try {
      const body = await c.req.json()
      const parsed = CreateGameSchema.safeParse(body)
      
      if (!parsed.success) {
        return c.json({ error: 'Invalid request body' }, 400)
      }

      // Check if image exists and is validated
      const image = images.find(img => img.id === parsed.data.imageId)
      if (!image) {
        return c.json({ error: 'Image not found' }, 404)
      }
      if (!image.validated) {
        return c.json({ error: 'Image not validated' }, 400)
      }

      // Check if date already has a game
      if (games.some(g => g.date.toISOString().split('T')[0] === parsed.data.date.toISOString().split('T')[0])) {
        return c.json({ error: 'Game already exists for this date' }, 400)
      }

      const newGame = {
        id: nextGameId++,
        imageId: parsed.data.imageId,
        date: parsed.data.date,
        plays: 0,
        totalDist: 0
      }

      games.push(newGame)
      return c.json({ game: newGame })
    } catch (e) {
      return c.json({ error: 'Internal server error' }, 500)
    }
  }
)

// Get games route with OpenAPI
route.openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags: ['games'],
    parameters: [
      {
        name: 'date',
        in: 'query',
        required: false,
        schema: z.string().optional()
      }
    ],
    responses: {
      200: {
        description: 'List of games',
        content: {
          'application/json': {
            schema: z.object({
              games: z.array(GameSchema)
            })
          }
        }
      },
      400: {
        description: 'Invalid date format',
        content: {
          'application/json': {
            schema: z.object({
              error: z.string()
            })
          }
        }
      },
      500: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: z.object({
              error: z.string()
            })
          }
        }
      }
    }
  }),
  async (c) => {
    try {
      const date = c.req.query('date')
      
      if (date) {
        const parsedDate = new Date(date)
        if (isNaN(parsedDate.getTime())) {
          return c.json({ error: 'Invalid date format' }, 400)
        }

        const filteredGames = games.filter(g => 
          g.date.toISOString().split('T')[0] === parsedDate.toISOString().split('T')[0]
        )
        return c.json({ games: filteredGames })
      }

      return c.json({ games })
    } catch (e) {
      return c.json({ error: 'Internal server error' }, 500)
    }
  }
)

import gameRoute from './[gameId]/index'
route.route('/:gameId/', gameRoute)

export default route