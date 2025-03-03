import { Hono } from 'hono'
import adminAuth from '../../adminAuth'

const route = new Hono()

// Routes
route.post('/', adminAuth, async (c) => {
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

    const newGame: Game = {
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
})

route.get('/', async (c) => {
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
})

import gameRoute from './[gameId]/index'
route.route('/:gameId/', gameRoute)

export default route