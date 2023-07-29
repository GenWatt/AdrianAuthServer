import UserSettings from '../models/UserSettings'
import User from '../models/User'

async function setUsersSettings() {
  // delete all users userSettings prop
  await User.updateMany({}, { $unset: { userSettings: '' } })
  const usersWithoutSettings = await User.find({
    userSettings: { $exists: false },
  })

  // Create default user settings for each user
  const defaultSettingsPromises = usersWithoutSettings.map(async (user) => {
    const defaultSettings = new UserSettings({
      theme: 'light',
      language: 'en',
      user: user._id,
    })

    await defaultSettings.save()
    user.userSettings = defaultSettings._id
    await user.save()
  })

  // Wait for all default settings to be created
  await Promise.all(defaultSettingsPromises)
}

export default setUsersSettings
