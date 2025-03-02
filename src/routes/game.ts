import express from 'express'
import { adminAuthMiddleware } from '../middleware/auth'
import { z } from 'zod'
import { getGameByDate, getGames, insertGame } from '../repository/game'
import { getImage } from '../repository/image'
import { logger } from '../util'

export const CreateGameRequestBody = z.object({
  imageId: z.number(),
  date: z
    .string()
    .transform((val) => new Date(val))
    .refine((val) => (val ? !isNaN(val.getTime()) : true)),
})

export const gameRouter = express.Router()

// create a game, given a date and an image id (admin)
gameRouter.post('/', adminAuthMiddleware, async (req, res) => {
  const parsedBody = CreateGameRequestBody.safeParse(req.body)

  if (parsedBody.error) {
    return (
      res.status(400).send({ error: `${parsedBody.error.message}` }), undefined
    )
  }

  const body = parsedBody.data

  try {
    const image = await getImage(body.imageId)
    if (image === null) {
      return (
        res
          .status(400)
          .send({ error: `image with id ${body.imageId} does not exist` }),
        undefined
      )
    }

    const createdGame = await insertGame({
      date: body.date,
      imageId: body.imageId,
      plays: 0,
      totalDist: 0,
    })

    res.status(200).send(createdGame)
  } catch (e) {
    logger.error(`failed to create game ${e}`)
    res.status(500).send({ error: `${e}` })
  }
})

const GetGamesSearchParams = z.object({
  date: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined))
    .refine((val) => (val ? !isNaN(val.getTime()) : true)),
})

// TODO: protect getting all routes? perhaps add separate /games-admin router
gameRouter.get('/', async (req, res) => {
  const parsedSearchParams = GetGamesSearchParams.safeParse(req.query)

  if (parsedSearchParams.error) {
    return (
      res.status(400).send({
        error: `invalid search params: ${parsedSearchParams.error.message}`,
      }),
      undefined
    )
  }

  const searchedParams = parsedSearchParams.data

  if (searchedParams.date) {
    // return only games on given date
    try {
      const game = await getGameByDate(searchedParams.date)

      if (game === null) {
        res
          .status(404)
          .send({ error: `no game on ${searchedParams.date} found` })
      } else {
        res.status(200).send({ game })
      }
    } catch (e) {
      logger.error(`failed to get game by date: ${e}`)
      res.status(500).send({ error: `failed to get games from db` })
    }
  } else {
    // return all games
    try {
      const games = await getGames()

      res.status(200).send({ games })
    } catch (e) {
      logger.error(`failed to get all games: ${e}`)
      res.status(500).send({ error: `failed to get games from db` })
    }
  }
})
