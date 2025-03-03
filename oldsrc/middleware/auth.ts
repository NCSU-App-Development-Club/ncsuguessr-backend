import express from 'express'
import { getAdminSecretToken, isValidAuthHeader } from '../util'

export const adminAuthMiddleware = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return (
      res.status(401).send({ error: 'missing authorization header' }), undefined
    )
  }
  const isValid = isValidAuthHeader(authHeader)

  if (!isValid) {
    return res.status(403).send({ error: 'invalid auth token' }), undefined
  }

  next()
}
