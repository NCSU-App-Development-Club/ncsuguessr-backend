import express, { Request, Response } from 'express'
import { adminAuthMiddleware } from '../middleware/auth'
import {
  getGameById,
  getGames,
  getGamesByDate,
  insertGame,
} from '../repository/game'
import { getImage } from '../repository/image'
import { isValidAuthHeader, logger } from '../util'
import {
  CreateGameRequestBody,
  ErrorResponseBodyType,
  GetGamesSearchParams,
  GetGamesSearchParamsType,
} from '../dto'
import { GameRowsType, GameRowType } from '../models/game'
import { generateGetSignedUrl } from '../util/s3'

export const gameRouter = express.Router()

// create a game, given a date and an image id (admin)
/**
 * @swagger
 *
 * /api/v1/games/:
 *   post:
 *     summary: Creates a new game given a data and image ID.
 *     tags:
 *     - Games
 *     security:
 *     - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Success.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Game"
 *       "400":
 *         description: Invalid request body.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 *       "500":
 *         description: Error writing to DB.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: "#/components/schemas/CreateGame"
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateGame"
 */
gameRouter.post(
  '/',
  adminAuthMiddleware,
  async (
    req: Request,
    res: Response<{ game: GameRowType } | ErrorResponseBodyType>
  ) => {
    const parsedBody = CreateGameRequestBody.safeParse(req.body)

    if (parsedBody.error) {
      return (
        res.status(400).send({ error: JSON.parse(parsedBody.error.message) }),
        undefined
      )
    }

    const body = parsedBody.data

    try {
      const image = await getImage(body.imageId)
      if (image === null) {
        return (
          res.status(400).send({
            error: `image with id ${body.imageId} does not exist`,
          }),
          undefined
        )
      }

      const createdGame = await insertGame({
        date: body.date,
        imageId: body.imageId,
        plays: 0,
        totalDist: 0,
      })

      res.status(200).send({ game: createdGame })
    } catch (e) {
      logger.error(`failed to create game ${e}`)
      res.status(500).send({ error: `${e}` })
    }
  }
)

/**
 * @swagger
 *
 * /api/v1/games/:
 *   get:
 *     summary: Fetches games with an optional date filter as a query parameter.
 *     tags:
 *     - Games
 *     parameters:
 *     - in: query
 *       name: date
 *       schema:
 *         type: string
 *         format: date
 *       description: An optional date to filter games by.
 *     responses:
 *       "200":
 *         description: Success.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 games:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Game"
 *       "400":
 *         description: Invalid request body.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 *       "404":
 *         description: Game not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 *       "500":
 *         description: Error writing to DB.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
gameRouter.get(
  '/',
  async (
    req: Request<{}, {}, {}, GetGamesSearchParamsType>,
    res: Response<
      | { games: GameRowsType }
      | {
          games: {
            id: number
            date: Date
          }[]
        }
      | ErrorResponseBodyType
    >
  ) => {
    const parsedSearchParams = GetGamesSearchParams.safeParse(req.query)

    if (parsedSearchParams.error) {
      return (
        res.status(400).send({
          error: JSON.parse(parsedSearchParams.error.message),
        }),
        undefined
      )
    }

    const searchParams = parsedSearchParams.data

    if (searchParams.date) {
      // return only games on given date
      try {
        const games = await getGamesByDate(searchParams.date)

        res.status(200).send({ games })
      } catch (e) {
        logger.error(`failed to get game by date: ${e}`)
        res.status(500).send({ error: `failed to get games from db` })
      }
    } else {
      try {
        const games = await getGames()

        res.status(200).send({ games })
      } catch (e) {
        logger.error(`failed to get all games: ${e}`)
        res.status(500).send({ error: `failed to get games from db` })
      }
    }
  }
)

/**
 * @swagger
 *
 * /api/v1/games/{gameId}:
 *   get:
 *     summary: Fetches a game by its ID.
 *     tags:
 *     - Games
 *     parameters:
 *     - in: path
 *       name: gameId
 *       schema:
 *         type: integer
 *       description: The ID of the game to fetch.
 *     responses:
 *       "200":
 *         description: Success.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 game:
 *                   $ref: "#/components/schemas/Game"
 *                 imageUrl:
 *                   type: string
 *                   format: url
 *       "400":
 *         description: Invalid request body.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 *       "404":
 *         description: Game not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 *       "500":
 *         description: Error writing to DB.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
gameRouter.get(
  '/:gameId',
  async (
    req: Request<{ gameId: string }>,
    res: Response<
      | {
          game: GameRowType
          imageUrl: string
        }
      | ErrorResponseBodyType
    >
  ) => {
    const gameId = parseInt(req.params.gameId)
    if (isNaN(gameId)) {
      return (
        res.status(400).send({ error: 'game id must be an integer' }), undefined
      )
    }

    try {
      const game = await getGameById(gameId)

      if (game === null) {
        return (
          res.status(404).send({ error: `game with id ${gameId} not found` }),
          undefined
        )
      }

      const image = await getImage(game.imageId)

      if (image === null) {
        return (
          res.status(500).send({ error: "game's associated image not found" }),
          undefined
        )
      }

      const imageUrl = await generateGetSignedUrl(image.fileLocation, 60000)

      return res.status(200).send({ game, imageUrl }), undefined
    } catch (e) {
      logger.error(`failed to get game by id: ${e}`)
      return (
        res.status(500).send({ error: `failed to get game from db` }), undefined
      )
    }
  }
)
