import { Hono } from 'hono'
import { swaggerUI } from '@hono/swagger-ui'
import { apiReference } from '@scalar/hono-api-reference'
import { OpenAPIHono } from '@hono/zod-openapi'

const app = new OpenAPIHono()

app.get(
    '/swagger',
    swaggerUI({
      url: '/doc'
    })
  )
  

  
  app.get(
    '/scalar',
    apiReference({
      theme: 'saturn',
      spec: { url: '/doc' },
    })
  )

  export default app