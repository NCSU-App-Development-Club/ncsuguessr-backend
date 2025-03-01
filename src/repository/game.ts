import { sql } from '.'
import {
  GameDates,
  GameDatesType,
  GameRow,
  GameRowType,
  NewGameType,
} from '../models/game'

// NOTE: this must be kept in sync with game model
export const createGamesTable = async () => {
  await sql`CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    image_id INTEGER NOT NULL REFERENCES images(id),
    date DATE NOT NULL,
    plays INTEGER NOT NULL,
    total_dist INTEGER NOT NULL
  )`
}

export const insertGame = async (game: NewGameType): Promise<GameRowType> => {
  const [inserted] = await sql`INSERT INTO games ${sql([game])} RETURNING *`

  return GameRow.parse(inserted)
}

export const getGameByDate = async (
  date: Date
): Promise<GameRowType | null> => {
  // TODO: works?
  const games = await sql`SELECT * FROM games WHERE date = ${date}`

  if (games.length === 0) {
    return null
  }

  return GameRow.parse(games[0])
}

export const getGameDates = async (): Promise<GameDatesType> => {
  const dates = await sql`SELECT date FROM games`

  // TODO: works? this assumes they are z.date()s
  return GameDates.parse(dates)
}
