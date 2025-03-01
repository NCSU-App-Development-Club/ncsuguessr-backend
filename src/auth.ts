import express from 'express'
import { getAdminSecretToken } from './util'

export const adminAuthMiddleware = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  // authorization header should be of the form `Bearer {token}`
  const authHeader = req.headers.authorization
  if (authHeader === undefined || !authHeader?.startsWith('Bearer ')) {
    return (
      res.status(401).send({ error: 'unauthorized: missing auth token' }),
      undefined
    )
  }

  const receivedToken = authHeader.slice(7)

  const trueToken = getAdminSecretToken()

  if (receivedToken !== trueToken) {
    return res.status(403).send({ error: 'invalid auth token' }), undefined
  }

  next()
}
