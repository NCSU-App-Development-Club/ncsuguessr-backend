import express from 'express'

export const imageRouter = express.Router()

// TODO: a route for uploading images: takes an image in the body, uploads it to s3, and adds it to the database--ensure that it acts like a transaction
imageRouter.post('/', (req, res) => {
  // TODO: use multipart form data
})

// TODO: route to get all non-validated images that have not been used for games (just data, not actual images)
// (admin)
imageRouter.get('/', (req, res) => {
  // TODO: query params to control which games are returned and which fields should be included
})

// TODO: route to generate a presigned url for getting a specific image from s3 by id
imageRouter.get('/:imageId', (req, res) => {
  // TODO
})
