import { sql } from '.'
import { ImageRow, NewImageType } from '../models/image'

export const createImagesTable = async () => {
  await sql`CREATE TABLE IF NOT EXISTS images (
    id SERIAL PRIMARY KEY,
    file_location CHAR(30) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    description TEXT NOT NULL,
    taken_at TIMESTAMP NOT NULL,
    validated BOOLEAN NOT NULL
  )`
}

export const insertImage = async (image: NewImageType) => {
  const [inserted] = await sql`INSERT INTO images ${sql([image])} RETURNING *`

  return ImageRow.parse(inserted)
}

// TODO: insert an image, given file location, latitude, longitude, description, and takenAt

// TODO: get all non-validated images that have not been used for a game
