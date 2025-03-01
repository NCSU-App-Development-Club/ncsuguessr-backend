import express from 'express'
import { getAdminSecretToken } from './util'

export const adminAuthMiddleware = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  // authorization header should be of the form `ApiKey {token}`
  const authHeader = req.headers.authorization
  if (authHeader === undefined || !authHeader?.startsWith('ApiKey ')) {
    return (
      res.status(401).send({ error: 'Unauthorized: Missing API key' }),
      undefined
    )
  }

  const receivedToken = authHeader.slice(7)

  const trueToken = getAdminSecretToken()

  if (receivedToken !== trueToken) {
    return res.status(403).send({ error: 'Invalid API key' }), undefined
  }

  next()
}
