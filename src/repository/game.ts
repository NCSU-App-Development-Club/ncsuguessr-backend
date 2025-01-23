import { getSqlClient } from '.'

export const createGamesTable = async () => {
  const sql = await getSqlClient

  await sql`CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    image_id INTEGER NOT NULL REFERENCES images(id),
    date DATE NOT NULL,
    plays INTEGER NOT NULL,
    total_dist INTEGER NOT NULL
  )`
}

// TODO: insert a game, given image id and date

// TODO: get a single game based on date

// TODO: get all dates
