import { sql } from '.'
import {
  GameDates,
  GameDatesType,
  GameRow,
  GameRows,
  GameRowsType,
  GameRowType,
  NewGameType,
} from '../models/game'

// NOTE: this must be kept in sync with game model
export const createGamesTable = async () => {
  await sql`CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    image_id INTEGER NOT NULL REFERENCES images(id),
    date DATE NOT NULL UNIQUE,
    plays INTEGER NOT NULL,
    total_dist INTEGER NOT NULL
  )`
}

export const insertGame = async (game: NewGameType): Promise<GameRowType> => {
  const [inserted] = await sql`INSERT INTO games ${sql([game])} RETURNING *`

  return GameRow.parse(inserted)
}

export const getGamesByDate = async (date: Date): Promise<GameRowsType> => {
  const games = await sql`SELECT * FROM games WHERE date = ${date}`

  return GameRows.parse(games)
}

export const getGames = async (): Promise<GameRowType[]> => {
  const games = await sql`SELECT * FROM GAMES`

  return GameRows.parse(games)
}

export const getGameById = async (
  gameId: number
): Promise<GameRowType | null> => {
  const foundGames = await sql`SELECT * from games WHERE id = ${gameId}`

  if (foundGames.length === 0) {
    return null
  }

  return GameRow.parse(foundGames[0])
}
