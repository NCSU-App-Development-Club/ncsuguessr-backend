import postgres from 'postgres'
import { config } from 'dotenv'
import { createImagesTable } from './image'
import { createGamesTable } from './game'

config() // loads dotenv

const sql = postgres({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'ncsuguessr',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  transform: postgres.camel,
})

export default sql

export const createAllTables = async () => {
  await createImagesTable()
  await createGamesTable()
}
