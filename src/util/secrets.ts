import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager'
import { z } from 'zod'

const RDSCredsSecret = z.object({
  username: z.string(),
  password: z.string(),
  host: z.string(),
})

export type RDSCredsSecretType = z.infer<typeof RDSCredsSecret>

const secrets = new SecretsManagerClient()

const getRDSSecretName = () => {
  const arn = process.env.RDS_CREDS_SECRET_NAME
  if (arn === undefined) {
    throw new Error('RDS_CREDS_SECRET_NAME not found')
  }

  return arn
}

export const getRDSConfig = async (): Promise<RDSCredsSecretType> => {
  const secretName = getRDSSecretName()

  const input = new GetSecretValueCommand({
    SecretId: secretName,
  })

  const res = await secrets.send(input)

  return RDSCredsSecret.parse(JSON.parse(res.SecretString ?? ''))
}
