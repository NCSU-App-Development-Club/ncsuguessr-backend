import { hc } from 'hono/client'
import { AppType } from './routes/index'

const client = hc<AppType>('/api')
client.games.$get({
  query: {
    date: '2024-01-01',
  },
})
const res = await client.hello.$get({
  query: {
    name: 'Hono',
  },
})

const data = await res.json()
console.log(`${data.message}`)