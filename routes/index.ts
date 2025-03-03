import { Hono } from 'hono'

const app = new OpenAPIHono()

app.get('/', (c) => {
  return c.json({ message: 'Hello, World!' })
})

import gamesRoute from './games/index'
app.route('/games/', gamesRoute)

export default app


app.get('/ui', swaggerUI({ url: '/doc' }))

import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'

app.openapi(
  createRoute({
    method: 'get',
    path: '/hello',
    responses: {
      200: {
        description: 'Respond a message',
        content: {
          'application/json': {
            schema: z.object({
              message: z.string()
            })
          }
        }
      }
    }
  }),
  (c) => {
    return c.json({
      message: 'hello'
    })
  }
)

app.get(
  '/swagger',
  swaggerUI({
    url: '/openapi'
  })
)

app.doc('/openapi', {
  info: {
    title: 'An API',
    version: 'v1'
  },
  openapi: '3.1.0'
})

import { apiReference } from '@scalar/hono-api-reference'

app.get(
  '/scalar',
  apiReference({
    theme: 'saturn',
    spec: { url: '/openapi' },
  })
)