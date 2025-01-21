import bodyParser from 'body-parser'
import express from 'express'
import { createAllTables } from './repository'
import { createBucket } from './util/s3'
import { DeployEnv, getDeployEnv } from './util'
import pino from 'pino'

const logger = pino()

const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {
  logger.info(req)

  next()
})

app.get('/', async (req, res) => {
  res.send('Hello')
})

const startApp = async () => {
  logger.info('creating database tables')
  await createAllTables()

  const deployEnv = getDeployEnv()
  if (deployEnv === DeployEnv.Values.local) {
    logger.info('creating s3 bucket')
    await createBucket()
  }

  const PORT = process.env.PORT || 3000

  app.listen(PORT, () => {
    logger.info(`server is running at http://localhost:${PORT}`)
  })
}

startApp()
