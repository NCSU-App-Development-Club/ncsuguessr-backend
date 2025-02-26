import { sql } from '.'

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

// TODO: insert a game, given image id and date

// TODO: get a single game based on date

// TODO: get all dates
