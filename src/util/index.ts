import { z } from 'zod'

export const DeployEnv = z.enum(['local', 'dev', 'prod'])
export type DeployEnvType = z.infer<typeof DeployEnv>

export const getDeployEnv = (): DeployEnvType => {
  const env = process.env.DEPLOY_ENV

  return DeployEnv.parse(env)
}
