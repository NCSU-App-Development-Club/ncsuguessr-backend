import postgres from 'postgres'
import { createImagesTable } from './image'
import { createGamesTable } from './game'
import { camelToSnake, DeployEnv, getDeployEnv, kebabToSnake } from '../util'

export const sql = postgres({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'ncsuguessr',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  transform: {
    column: {
      from: postgres.toCamel,
      to: camelToSnake,
    }, // Convert column names (snake_case → camelCase)
  },
  // TODO: for staging as well?
  ssl: getDeployEnv() === DeployEnv.Values.prod,
})

export const createAllTables = async () => {
  await createImagesTable()
  await createGamesTable()
}
