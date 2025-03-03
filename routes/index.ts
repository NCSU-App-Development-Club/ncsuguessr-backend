import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'

const app = new OpenAPIHono()

// Serve a simple HTML page with links to documentation
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>API Documentation</title>
      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          line-height: 1.6;
        }
        h1 {
          margin-bottom: 1.5rem;
        }
        ul {
          list-style-type: none;
          padding: 0;
        }
        li {
          margin-bottom: 1rem;
        }
        a {
          display: inline-block;
          padding: 0.5rem 1rem;
          background-color: #f0f0f0;
          color: #333;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 500;
        }
        a:hover {
          background-color: #e0e0e0;
        }
      </style>
    </head>
    <body>
      <h1>API Documentation</h1>
      <ul>
        <li><a href="/doc/swagger">Swagger Documentation</a></li>
        <li><a href="/doc/scalar">Scalar Documentation</a></li>
      </ul>
    </body>
    </html>
  `)
})

app.doc('/doc', {
  info: {
    title: 'An API',
    version: 'v1'
  },
  openapi: '3.1.0'
})

import doc from './doc/index'
app.route('/doc/', doc)

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

import gamesRoute from './games/index'
app.route('/games/', gamesRoute)

export type AppType = typeof app
export default app