import { injectable } from 'inversify'
import User from '../models/User'
import HttpError from '../errors/HttpError'
import { IUserSettings, IUser } from '../types/types'

@injectable()
class UserSettingsService {
  public getUserSettings = async (user: IUser) => {
    const userSettings = await User.findOne({ user: user._id }).select({ userSettings: 1 })

    if (!userSettings) {
      throw new HttpError(404, 'User settings not found')
    }

    return userSettings
  }

  public updateUserSettings = async (
    user: IUser,
    userSettings: IUserSettings
  ) => {
    if (!user) {
      throw new HttpError(404, 'User not found')
    }

    const updatedUserSettings = await User.findOneAndUpdate(
      { _id: user._id },
      { userSettings },
      { new: true }
    )

    if (!updatedUserSettings) {
      throw new HttpError(404, 'User settings not found')
    }

    return updatedUserSettings
  }
}

export default UserSettingsService
