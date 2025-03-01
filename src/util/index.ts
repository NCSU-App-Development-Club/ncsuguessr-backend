import { z } from 'zod'
import pino from 'pino'

export const logger = pino()

// local = this app running locally, with local postgres and localstack
// dev = this app running locally, but using the dev AWS resources
// staging = using the dev AWS resources, should only be used for the staging branch with CI
// prod = using the prod AWS resources, should only be used for the prod branch with CI
export const DeployEnv = z.enum(['local', 'staging', 'prod', 'dev'])
export type DeployEnvType = z.infer<typeof DeployEnv>

export const getDeployEnv = (): DeployEnvType => {
  const env = process.env.DEPLOY_ENV

  return DeployEnv.parse(env)
}

export const getAdminSecretToken = (): string => {
  const name = `ADMIN_SECRET_TOKEN`
  const token = process.env[name]

  if (!token) {
    throw new Error(`no ${name} found`)
  }

  return token
}

export const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

export const kebabToSnake = (str: string): string => {
  return str.replace(/-/g, '_')
}
