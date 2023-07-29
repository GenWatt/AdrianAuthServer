import { injectable } from 'inversify'
import { IUser } from '../types/types'
import User from '../models/User'
import AuthServices from './AuthService'
import container from '../inversify.config'
import { Response } from 'express'
import ProfilePictureService from './ProfilePictureService'
import UserSettings from '../models/UserSettings'
import AuthDatabase from '../db/AuthDatabase'

@injectable()
class UserService {
  private authServices: AuthServices = container.get<AuthServices>(AuthServices)
  private profilePictureService: ProfilePictureService =
    container.get<ProfilePictureService>(ProfilePictureService)
  private authDatabase: AuthDatabase = container.get<AuthDatabase>(AuthDatabase)

  public deactivateAccount = async (user: IUser, res: Response) => {
    await User.updateOne({ _id: user._id }, { active: false }, { new: true })
    await this.authServices.logout(user, res)
  }

  public deleteAccount = async (user: IUser, res: Response) => {
    await UserSettings.deleteOne(
      { user: user._id },
      this.authDatabase.getSessionObject()
    )
    await User.deleteOne(
      { _id: user._id },
      this.authDatabase.getSessionObject()
    )

    await this.authServices.logout(user, res)
    await this.profilePictureService.removeProfilePicture(user)
  }
}

export default UserService
