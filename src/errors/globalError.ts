import { Request, Response, NextFunction } from 'express'

function globalError(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err) {
    console.log(err, 'global error')
    if (!err.status) {
      res.status(500).json({ message: 'Internal Server Error' })
    }
    res.status(err.status).json({ success: false, message: err.message })
  }
}

export default globalError
