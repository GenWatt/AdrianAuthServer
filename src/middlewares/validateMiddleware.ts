import { NextFunction, Response, Request } from 'express'
import joi from 'joi'

enum ValidateType {
  BODY = 'body',
  PARAMS = 'params',
  QUERY = 'query',
}

function validateMiddleware(
  schema: joi.ObjectSchema<any>,
  validateType: ValidateType = ValidateType.BODY
) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = schema.validate(req[validateType])

      if (error) {
        return res.status(400).json({ success: false, message: error.message })
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}

export default validateMiddleware
