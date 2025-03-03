import express, { Request, Response } from 'express'
import multer, { FileFilterCallback } from 'multer'
import {
  getImage,
  getUnvalidatedImages,
  insertImage,
} from '../repository/image'
import { ImageRowType, NewImageType, ImageRowsType } from '../models/image'
import { deleteFromS3, generateGetSignedUrl, putToS3 } from '../util/s3'
import { randomUUID } from 'node:crypto'
import { adminAuthMiddleware } from '../middleware/auth'
import {
  ErrorResponseBodyType,
  ImageSubmissionForm,
  ImageSubmissionFormType,
} from '../dto'
import { logger } from '../util'
import { camelCaseBodyMiddleware } from '../middleware/transform'

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const storage = multer.memoryStorage()
const limits = {
  fileSize: 1024 * 1024 * 5, // 5MB limit
  files: 1,
}
const upload = multer({ fileFilter, storage, limits })

export const imageRouter = express.Router()

// Takes an image in the body, uploads it to s3, and adds it to the database.
// If s3 put fails, nothing is written to db. If s3 put succeeds and db write
// fails, attempts delete object from s3.
imageRouter.post(
  '/',
  upload.single('image'),
  camelCaseBodyMiddleware,
  async (
    req: Request<{}, {}, ImageSubmissionFormType>,
    res: Response<{ image: ImageRowType } | ErrorResponseBodyType>
  ) => {
    if (!req.file) {
      return (
        res
          .status(400)
          .send({ error: 'Invalid body: missing or invalid image.' }),
        undefined
      )
    }
    const parsedImageBody = ImageSubmissionForm.safeParse(req.body)
    if (parsedImageBody.error) {
      return (
        res.status(400).send({
          error: JSON.parse(parsedImageBody.error.message),
        }),
        undefined
      )
    }

    const fileLocation = randomUUID().trim()

    // Add to S3
    try {
      await putToS3(fileLocation, req.file.buffer)
    } catch (e) {
      logger.error(`error uploading to s3: ${e}`)
      return (
        res.status(500).send({ error: 'Error uploading image to S3.' }),
        undefined
      )
    }

    // Add to SQL
    const newImage: NewImageType = {
      ...parsedImageBody.data,
      fileLocation,
      validated: false,
    }

    try {
      const result = await insertImage(newImage)
      return res.status(200).send({ image: result }), undefined
    } catch (e) {
      logger.error(`error inserting image into db: ${e}`)
    }

    // rollback s3 insertion if db write fails
    try {
      await deleteFromS3(fileLocation)
    } catch (e) {
      logger.warn(
        `orphaned element in S3 with key: ${fileLocation}. s3 error: ${e}`
      )
    }
    res.status(500).send({ error: "Couldn't write to DB." })
  }
)

// TODO: make this return all images by default, and add a query param for ?validated=false
// Gets all non-validated images that have not been used for games
// (just data, not actual images). Admin-only.
imageRouter.get(
  '/',
  adminAuthMiddleware,
  async (
    req: Request<{}, {}, {}>,
    res: Response<{ images: ImageRowsType } | ErrorResponseBodyType>
  ) => {
    try {
      const unvalidatedImages = await getUnvalidatedImages()
      res.status(200).send({ images: unvalidatedImages })
    } catch (e) {
      logger.error(`error fetching unvalidated images: ${e}`)
      res.status(500).send({ error: 'Failed to fetch unvalidated images.' })
    }
  }
)

// Route to generate a presigned URL for getting a specific image from s3 by ID.
imageRouter.get(
  '/:imageId/url',
  async (
    req: Request<{ imageId: string }, {}, {}>,
    res: Response<{ signedUrl: string } | ErrorResponseBodyType>
  ) => {
    const imageId = parseInt(req.params.imageId)
    if (isNaN(imageId) || imageId.toString() !== req.params.imageId)
      return res.status(400).send({ error: 'Invalid image ID.' }), undefined

    let imageKey
    try {
      imageKey = await getImage(imageId)
    } catch (e) {
      logger.error(`failed to fetch image from db: ${e}`)
      return (
        res.status(500).send({ error: "Couldn't get image key." }), undefined
      )
    }

    if (!imageKey)
      return (
        res.status(500).send({ error: "Couldn't get image key." }), undefined
      )

    console.log(imageKey)
    try {
      const signedUrl = await generateGetSignedUrl(imageKey.fileLocation, 60000)
      res.status(200).send({ signedUrl })
    } catch (e) {
      logger.error(`failed to get presigned url: ${e}`)
      res.status(500).send({ error: 'Error fetching URL.' })
    }
  }
)
