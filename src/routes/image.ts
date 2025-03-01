import express from 'express'
import multer from 'multer'

import {
  getImage,
  getUnvalidatedImages,
  insertImage,
} from '../repository/image'

import { ImageSubmission, ImageSubmissionSchema } from '../dto'
import { ImageRowsType } from '../models/image'
import { NewImageType } from '../models/image'
import { toCamelCaseBody } from '../util/routes'
import { generateGetSignedUrl, putToS3 } from '../util/s3'
import { randomUUID } from 'node:crypto'

const storage = multer.memoryStorage()
const upload = multer({ storage })

export const imageRouter = express.Router()

// TODO: a route for uploading images: takes an image in the body, uploads it to s3, and adds it to the database--ensure that it acts like a transaction
imageRouter.post('/', upload.single('image'), async (req, res) => {
  const pre: any = toCamelCaseBody(req.body)
  if (!ImageSubmissionSchema.safeParse(pre).success || !req.file)
    return res.status(400).send('error'), undefined

  const fileLocation = randomUUID().trim()

  // Add to S3
  try {
    await putToS3(fileLocation, req.file.buffer)
  } catch {
    return res.status(500).send('error uploading image to S3'), undefined
  }

  // Add to SQL
  const body: ImageSubmission = pre
  const newImage: NewImageType = {
    ...body,
    fileLocation,
    validated: false,
  }

  console.log(newImage)

  try {
    const result = await insertImage(newImage)
    res.status(200).send(result)
  } catch (e) {
    console.log(e)
    res.status(500).send("couldn't write to db")
  }
})

// TODO: route to get all non-validated images that have not been used for games (just data, not actual images)
// (admin)
imageRouter.get('/', async (req, res) => {
  // TODO: query params to control which games are returned and which fields should be included
  let unvalidatedImages: ImageRowsType
  try {
    unvalidatedImages = await getUnvalidatedImages()
    res.status(200).send(unvalidatedImages)
  } catch {
    res.status(500).send('failed to fetch unvalidated images')
  }
})

// TODO: route to generate a presigned url for getting a specific image from s3 by id
imageRouter.get('/:imageId', async (req, res) => {
  const imageId = parseInt(req.params.imageId)
  if (isNaN(imageId) || imageId.toString() !== req.params.imageId)
    return res.status(400).send('bad image id'), undefined

  let imageKey
  try {
    imageKey = await getImage(imageId)
  } catch {
    return res.status(500).send("couldn't get image key"), undefined
  }

  if (!imageKey)
    return res.status(500).send("couldn't get image key"), undefined

  console.log(imageKey)
  try {
    const signedUrl = await generateGetSignedUrl(imageKey.fileLocation, 60000)
    res.status(200).send(signedUrl)
  } catch {
    res.status(500).send('error fetching URL')
  }
})
