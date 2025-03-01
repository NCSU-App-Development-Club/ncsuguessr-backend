import { sql } from '.'
import {
  ImageRow,
  ImageRows,
  ImageRowsType,
  ImageRowType,
  NewImageType,
} from '../models/image'

// NOTE: this must be in sync with image model
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

export const insertImage = async (
  image: NewImageType
): Promise<ImageRowType> => {
  const [inserted] = await sql`INSERT INTO images ${sql([image])} RETURNING *`

  return ImageRow.parse(inserted)
}

export const getImage = async (imageId: number): Promise<ImageRowType> => {
  const [inserted] = await sql`SELECT * FROM images WHERE id = ${imageId}`

  return ImageRow.parse(inserted)
}

// admin
export const validateImage = async (imageId: number): Promise<ImageRowType> => {
  const [updated] =
    await sql`UPDATE images SET validated = true WHERE id = ${sql([imageId])} RETURNING *`

  return ImageRow.parse(updated)
}

// admin
export const getUnvalidatedImages = async (): Promise<ImageRowsType> => {
  const unvalidatedImages =
    await sql`SELECT * FROM images WHERE validated = false`

  return ImageRows.parse(unvalidatedImages)
}
