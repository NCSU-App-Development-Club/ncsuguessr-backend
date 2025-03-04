import { config } from 'dotenv'
// loads environment variables from the .env file
config({})

import bodyParser from 'body-parser'
import express from 'express'
import { createAllTables } from './repository'
import { createBucket, putToS3 } from './util/s3'
import { DeployEnv, getDeployEnv } from './util'
import { logger } from './util'

// the primary construct representing the app--routes and middleware will be added using `app`
const app = express()

// use middleware to parse incoming JSON data
// TODO: make sure this doesn't interfere with accepting images
app.use(bodyParser.json())

// create basic middleware that logs all incoming requests to stdout (console)
app.use((req, res, next) => {
  logger.info(req)

  next()
})

app.get('/', async (req, res) => {
  res.send('Hello')
})

// initialization logic
const startApp = async () => {
  // sends a request to the database to create the necessary tables if they do not already exist
  logger.info('creating database tables')
  await createAllTables()

  // this gets the current deployment environment (i.e. 'local' vs 'dev' vs 'prod'),
  // and creates an S3 bucket on localstack if this app is being run in a local environment
  const deployEnv = getDeployEnv()
  if (deployEnv === DeployEnv.Values.local) {
    logger.info('creating s3 bucket')
    await createBucket()
  }

  const PORT = process.env.PORT || 3000

  // start the server, listen for requests
  app.listen(PORT, () => {
    logger.info(`server is running at http://localhost:${PORT}`)
  })
}

startApp()
