import {
  S3Client,
  GetObjectCommand,
  CreateBucketCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { DeployEnv, getDeployEnv } from '.'
import { Readable } from 'stream'

const s3 = new S3Client()

const s3BucketName = process.env.S3_BUCKET_NAME
if (s3BucketName === undefined) {
  throw new Error("environment variable 'S3_BUCKET_NAME' is not defined")
}

// NOTE: ONLY TO BE USED FOR LOCALSTACK DEPLOYS (i.e. 'local' environment)
export const createBucket = async () => {
  const deployEnv = getDeployEnv()
  if (deployEnv !== DeployEnv.Values.local) {
    throw new Error(
      `cannot create new S3 bucket on a non-local deployment (currently on ${deployEnv})`
    )
  }

  await s3.send(
    new CreateBucketCommand({
      Bucket: s3BucketName,
    })
  )
}

export const generateGetSignedUrl = async (
  key: string,
  expiresIn: number
): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: s3BucketName,
    Key: key,
  })

  const signedUrl = await getSignedUrl(s3, command, { expiresIn })
  return signedUrl
}

export const putToS3 = async (
  key: string,
  content: string | Uint8Array | Buffer | Readable
) => {
  const command = new PutObjectCommand({
    Bucket: s3BucketName,
    Key: key,
    Body: content,
  })

  await s3.send(command)
}
