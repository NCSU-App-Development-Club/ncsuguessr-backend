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
    file_location CHAR(36) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    description TEXT NOT NULL,
    taken_at TIMESTAMP NOT NULL,
    validated BOOLEAN NOT NULL,
    location_name VARCHAR(50) NOT NULL
  )`
}

export const insertImage = async (
  image: NewImageType
): Promise<ImageRowType> => {
  const [inserted] = await sql`INSERT INTO images ${sql([image])} RETURNING *`

  return ImageRow.parse(inserted)
}

export const getImage = async (
  imageId: number
): Promise<ImageRowType | null> => {
  const images = await sql`SELECT * FROM images WHERE id = ${imageId}`

  if (images.length === 0) {
    return null
  }

  return ImageRow.parse(images[0])
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

// admin
export const getValidatedImages = async (): Promise<ImageRowsType> => {
  const validatedImages = await sql`SELECT * FROM images WHERE validated = true`

  return ImageRows.parse(validatedImages)
}

// admin
export const getImages = async (): Promise<ImageRowsType> => {
  const Images = await sql`SELECT * FROM images`

  return ImageRows.parse(Images)
}
