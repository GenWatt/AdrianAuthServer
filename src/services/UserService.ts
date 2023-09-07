import { injectable } from 'inversify'
import { IUser } from '../types/types'
import User from '../models/User'
import AuthServices from './AuthService'
import container from '../inversify.config'
import { Response } from 'express'
import FileService from './FileService'

@injectable()
class UserService {
  private authServices: AuthServices = container.get<AuthServices>(AuthServices)
  private FileService: FileService =
    container.get<FileService>(FileService)

  public deactivateAccount = async (user: IUser, res: Response) => {
    await User.updateOne({ _id: user._id }, { active: false }, { new: true })
    await this.authServices.logout(user, res)
  }

  public deleteAccount = async (user: IUser, res: Response) => {
    await this.authServices.logout(user, res)
    await this.FileService.removeProfilePicture(user)
    await this.FileService.removeCoverPicture(user)
    // all
    await User.deleteOne(
      { _id: user._id }
    )
  }
}

export default UserService
