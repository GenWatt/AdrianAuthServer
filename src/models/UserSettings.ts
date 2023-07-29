import mongoose from 'mongoose'
import { IUSerSettings } from '../types/types'

const UserSettingsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
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

const UserSettings = mongoose.model<IUSerSettings>(
  'UserSettings',
  UserSettingsSchema
)

export default UserSettings
