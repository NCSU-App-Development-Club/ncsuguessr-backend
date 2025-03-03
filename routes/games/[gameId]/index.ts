import { Hono } from 'hono'
import { games, images } from '../../../db'
import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { z } from 'zod'

const route = new OpenAPIHono()

// Define schemas for response
const GameSchema = z.object({
  id: z.number(),
  imageId: z.number(),
  date: z.date(),
  plays: z.number(),
  totalDist: z.number()
})

// Get game by ID route with OpenAPI
route.openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags: ['games'],
    parameters: [
      {
        name: 'gameId',
        in: 'path',
        required: true,
        schema: z.string(),
        description: 'Game ID'
      }
    ],
    responses: {
      200: {
        description: 'Game details with image URL',
        content: {
          'application/json': {
            schema: z.object({
              game: GameSchema,
              imageUrl: z.string()
            })
          }
        }
      },
      400: {
        description: 'Invalid game ID',
        content: {
          'application/json': {
            schema: z.object({
              error: z.string()
            })
          }
        }
      },
      404: {
        description: 'Game not found',
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
      // @ts-ignore todo https://github.com/honojs/hono/issues/2760
      const gameId = parseInt(c.req.param('gameId'))
      if (isNaN(gameId)) {
        return c.json({ error: 'Invalid game ID' }, 400)
      }

      const game = games.find(g => g.id === gameId)
      if (!game) {
        return c.json({ error: 'Game not found' }, 404)
      }

      const image = images.find(img => img.id === game.imageId)
      if (!image) {
        return c.json({ error: 'Associated image not found' }, 500)
      }

      // Mock signed URL generation
      const imageUrl = `https://mock-s3-bucket.com/${image.fileLocation}?signed=true`

      return c.json({ 
        game,
        imageUrl
      })
    } catch (e) {
      return c.json({ error: 'Internal server error' }, 500)
    }
  }
)

export default route