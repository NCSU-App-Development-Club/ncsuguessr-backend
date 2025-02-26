import express from 'express'

export const gameRouter = express.Router()

// TODO: route to create a game, given a date and an image id (admin)
gameRouter.post('/', (req, res) => {
  // TODO
})

// TODO: route to get a specific game, given a date (i.e. columns in games table, including image id)
gameRouter.get('/:gameId', (req, res) => {
  // TODO
})

// TODO: route to get a list of games
gameRouter.get('/', (req, res) => {
  // TODO: use query params to control which fields returned
})
