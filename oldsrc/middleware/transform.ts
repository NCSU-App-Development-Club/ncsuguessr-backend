import express from 'express'
import { toCamelCaseBody } from '../util/routes'

// Express middleware for transforming kebab-case request bodies to camelCase.
// TODO: look into using lodash for converting all bodies of any form into camelCase.
export const camelCaseBodyMiddleware = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  req.body = toCamelCaseBody(req.body)
  next()
}
