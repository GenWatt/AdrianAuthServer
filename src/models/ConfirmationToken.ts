import mongoose from 'mongoose'
import { IConfirmationToken } from '../types/types'

const confirmationTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
})

export default mongoose.model<IConfirmationToken>(
  'ConfirmationToken',
  confirmationTokenSchema
)
