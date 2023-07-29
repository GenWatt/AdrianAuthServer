import { injectable } from 'inversify'
import UserSettings from '../models/UserSettings'
import HttpError from '../errors/HttpError'
import { IUSerSettings, IUser } from '../types/types'

@injectable()
class UserSettingsService {
  public getUserSettings = async (user: IUser) => {
    const userSettings = await UserSettings.findOne({ user: user._id })

    if (!userSettings) {
      throw new HttpError(404, 'User settings not found')
    }

    return userSettings
  }

  public updateUserSettings = async (
    user: IUser,
    userSettings: IUSerSettings
  ) => {
    if (!user) {
      throw new HttpError(404, 'User not found')
    }

    const updatedUserSettings = await UserSettings.findOneAndUpdate(
      { user: user._id },
      userSettings,
      { new: true }
    )

    if (!updatedUserSettings) {
      throw new HttpError(404, 'User settings not found')
    }

    return updatedUserSettings
  }
}

export default UserSettingsService
