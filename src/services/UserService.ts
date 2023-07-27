import { injectable } from 'inversify'
import { IUser } from '../types/types'
import User from '../models/User'
import AuthServices from './AuthService'
import container from '../inversify.config'
import { Response } from 'express'
import ProfilePictureService from './ProfilePictureService'

@injectable()
class UserService {
  private authServices: AuthServices = container.get<AuthServices>(AuthServices)
  private profilePictureService: ProfilePictureService =
    container.get<ProfilePictureService>(ProfilePictureService)

  public deactivateAccount = async (user: IUser, res: Response) => {
    await User.updateOne({ _id: user._id }, { active: false }, { new: true })
    await this.authServices.logout(user, res)
  }

  public deleteAccount = async (user: IUser, res: Response) => {
    await User.deleteOne({ _id: user._id })
    await this.authServices.logout(user, res)

    await this.profilePictureService.removeProfilePicture(user)
  }
}

export default UserService
