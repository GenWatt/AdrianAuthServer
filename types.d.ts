import { IUser } from './src/types/types'

declare global {
  namespace Express {
    interface Request {
      user: IUser
    }
  }
}
