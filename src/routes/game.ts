import express from 'express'
import { adminAuthMiddleware } from '../auth'
import { z } from 'zod'
import { ImageRowType } from '../models/image'
import { getGamesByDate, insertGame } from '../repository/game'

export const CreateGameRequestBody = z.object({
  imageId: z.number(),
  date: z
    .string()
    .transform((val) => new Date(val))
    .refine((val) => (val ? !isNaN(val.getTime()) : true)),
})

const getImage = async (imageId: number): Promise<ImageRowType | null> => {
  // TODO:
  return null
}

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
    // TODO: how to log
    console.error(e)
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

gameRouter.get('/', async (req, res) => {
  const parsedSearchParams = GetGamesSearchParams.safeParse(req.query)

  if (parsedSearchParams.error) {
    return (
      res.status(400).send({
        error: `bad search params: ${parsedSearchParams.error.message}`,
      }),
      undefined
    )
  }

  const searchedParams = parsedSearchParams.data

  if (!searchedParams.date) {
    return (
      res.status(400).send({ error: 'missing date in search parameters' }),
      undefined
    )
  }

  try {
    const games = await getGamesByDate(searchedParams.date)

    res.status(200).send({ games })
  } catch (e) {
    console.error(e)
    res.status(500).send({ error: `${e}` })
  }
})
