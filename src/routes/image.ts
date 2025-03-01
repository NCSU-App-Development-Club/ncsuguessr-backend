import express from 'express'
import multer from 'multer'
import {
  getImage,
  getUnvalidatedImages,
  insertImage,
} from '../repository/image'
import { NewImageType } from '../models/image'
import { toCamelCaseBody } from '../util/routes'
import { generateGetSignedUrl, putToS3 } from '../util/s3'
import { randomUUID } from 'node:crypto'
import { adminAuthMiddleware } from '../auth'
import { ImageSubmissionFormSchema } from '../dto'
import { logger } from '../util'

const storage = multer.memoryStorage()
const upload = multer({ storage })

export const imageRouter = express.Router()

// takes an image in the body, uploads it to s3, and adds it to the database--ensure that it acts like a transaction
imageRouter.post('/', upload.single('image'), async (req, res) => {
  const pre: any = toCamelCaseBody(req.body)
  const parsedImageBody = ImageSubmissionFormSchema.safeParse(pre)
  if (parsedImageBody.error || !req.file) {
    return (
      res
        .status(400)
        .send({ error: `invalid body: ${parsedImageBody.error?.message}` }),
      undefined
    )
  }

  const fileLocation = randomUUID().trim()

  // Add to S3
  try {
    await putToS3(fileLocation, req.file.buffer)
  } catch (e) {
    logger.error(`error uploading to s3: ${e}`)
    return res.status(500).send('error uploading image to S3'), undefined
  }

  // Add to SQL
  const newImage: NewImageType = {
    ...parsedImageBody.data,
    fileLocation,
    validated: false,
  }

  console.log(newImage)

  try {
    const result = await insertImage(newImage)
    res.status(200).send(result)
  } catch (e) {
    logger.error(`error inserting image into db: ${e}`)
    res.status(500).send({ error: "couldn't write to db" })
  }
})

// gets all non-validated images that have not been used for games (just data, not actual images)
// (admin)
imageRouter.get('/', adminAuthMiddleware, async (req, res) => {
  try {
    const unvalidatedImages = await getUnvalidatedImages()
    res.status(200).send({ images: unvalidatedImages })
  } catch (e) {
    logger.error(`error fetching unvalidated images: ${e}`)
    res.status(500).send({ error: 'failed to fetch unvalidated images' })
  }
})

// route to generate a presigned url for getting a specific image from s3 by id
imageRouter.get('/:imageId/url', async (req, res) => {
  const imageId = parseInt(req.params.imageId)
  if (isNaN(imageId) || imageId.toString() !== req.params.imageId)
    return res.status(400).send('bad image id'), undefined

  let imageKey
  try {
    imageKey = await getImage(imageId)
  } catch (e) {
    logger.error(`failed to fetch image from db: ${e}`)
    return res.status(500).send({ error: "couldn't get image key" }), undefined
  }

  if (!imageKey)
    return res.status(500).send({ error: "couldn't get image key" }), undefined

  console.log(imageKey)
  try {
    const signedUrl = await generateGetSignedUrl(imageKey.fileLocation, 60000)
    res.status(200).send({ signedUrl })
  } catch (e) {
    logger.error(`failed to get presigned url: ${e}`)
    res.status(500).send({ error: 'error fetching URL' })
  }
})
