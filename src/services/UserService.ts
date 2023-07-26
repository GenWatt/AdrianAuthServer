import { injectable } from 'inversify'
import { IUser } from '../types/types'
import User from '../models/User'
import AuthServices from './AuthService'
import container from '../inversify.config'
import { Response } from 'express'

@injectable()
class UserService {
  private authServices: AuthServices = container.get<AuthServices>(AuthServices)

  public deactivateAccount = async (user: IUser, res: Response) => {
    await User.updateOne({ _id: user._id }, { isActive: false })
    await this.authServices.logout(user, res)
  }
}

export default UserService
