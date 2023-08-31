import mongoose from 'mongoose'
import { IUserSettings } from '../types/types'

export const UserSettingsSchema = new mongoose.Schema<IUserSettings>({
  theme: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light',
  },
  language: {
    type: String,
    enum: ['en', 'pl'],
    default: 'en',
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
  },
})

const UserSettings = mongoose.model<IUserSettings>(
  'UserSettings',
  UserSettingsSchema
)

export default UserSettings