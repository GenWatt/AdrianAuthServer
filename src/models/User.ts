import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { IUser } from '../types/types'

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 25,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    max: 50,
    unique: true,
  },
  password: {
    type: String,
    min: 6,
  },
  profilePicture: {
    type: String,
    default: '',
  },
  coverPicture: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  googleId: {
    type: String,
    default: '',
  },
  provider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  },
  refreshToken: {
    type: String,
    default: '',
  },
  isLogged: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
})

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next()
  }

  if (!this.password) {
    return next()
  }

  bcrypt.hash(this.password, 10, (err, passwordHash) => {
    if (err) {
      return next(err)
    }

    this.password = passwordHash
    next()
  })
})

UserSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() })
  next()
})

const User = mongoose.model<IUser>('Users', UserSchema)

export default User
