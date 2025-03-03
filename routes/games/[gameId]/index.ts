import { Hono } from 'hono'
import { games, images } from '../../../db'

const route = new Hono()

route.get('/', async (c) => {
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
})

export default route