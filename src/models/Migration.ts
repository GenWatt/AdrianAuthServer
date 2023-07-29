import mongoose from 'mongoose'
import { IMigration } from '../types/types'

const MigrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  done: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
  },
})

const Migration = mongoose.model<IMigration>('Migration', MigrationSchema)

export default Migration
