import User from '../models/User'
import UserSettings from '../models/UserSettings'

async function setUsersSettings() {
  // delete all users userSettings prop
  await User.updateMany({}, { $unset: { userSettings: '' } })
  const usersWithoutSettings = await User.find({
    userSettings: { $exists: false },
  })

  // Create default user settings for each user
  const defaultSettingsPromises = usersWithoutSettings.map(async (user) => {
    user.userSettings = new UserSettings()
    await user.save()
  })

  // Wait for all default settings to be created
  await Promise.all(defaultSettingsPromises)
}

export default setUsersSettings
