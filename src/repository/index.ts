import postgres from 'postgres'
import { createImagesTable } from './image'
import { createGamesTable } from './game'
import { DeployEnv, getDeployEnv } from '../util'
import { getRDSConfig } from '../util/secrets'
import { logger } from '../util'

const getSqlClientFn = async (): Promise<postgres.Sql<{}>> => {
  const deployEnv = getDeployEnv()
  if (deployEnv !== DeployEnv.Values.local) {
    const rdsConfig = await getRDSConfig()

    process.env.DB_USER = rdsConfig.username
    process.env.DB_PASSWORD = rdsConfig.password
    process.env.DB_HOST = rdsConfig.host
  }

  logger.info(`connecting to database at ${process.env.DB_HOST}`)

  return postgres({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'ncsuguessr',
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    transform: postgres.camel,
    // TODO: for staging as well?
    ssl: deployEnv === DeployEnv.Values.prod,
  })
}

export const getSqlClient = getSqlClientFn()

export const createAllTables = async () => {
  await createImagesTable()
  await createGamesTable()
}
