import { Types } from 'mongoose'
enum MethodTypes {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

interface UserBody {
  username: string
  email: string
  password: string
}

interface ILoginUser {
  identifier: string
  password: string
}

interface UserToToken {
  _id: Types.ObjectId
  username: string
  email: string
}

interface IConfirmationToken {
  email: string
  _id: Types.ObjectId
  token: string
}

interface IUser {
  _id: Types.ObjectId
  username: string
  email: string
  password: string
  profilePicture: string
  coverPicture: string
  createdAt: Date
  updatedAt: Date
  role: string
  isVerified: boolean
  googleId: string
  provider: string
  refreshToken: string
  isLogged: boolean
  active: boolean
  userSettings: Types.ObjectId
}

interface IDecodedToken {
  _id: string
  username: string
  email: string
  iat: number
  exp: number
  isValid: boolean
}

interface IDecodedResetToken {
  type: 'reset'
  email: string
  iat: number
  exp: number
}

interface IDecodedConfirmToken {
  type: 'confirm'
  email: string
  iat: number
  exp: number
}

interface LoginData {
  accessToken: string
  refreshToken: string
  callbackUrl?: string
}

interface IUSerSettings {
  _id: Types.ObjectId
  user: Types.ObjectId
  theme: 'dark' | 'light'
  language: 'en' | 'pl'
  createdAt: Date
  updatedAt: Date
}

interface IMigration {
  name: string
  done: boolean
  createdAt: Date
  updatedAt: Date
  _id: Types.ObjectId
}

export {
  MethodTypes,
  UserBody,
  UserToToken,
  IDecodedToken,
  LoginData,
  ILoginUser,
  IUser,
  IConfirmationToken,
  IDecodedResetToken,
  IDecodedConfirmToken,
  IUSerSettings,
  IMigration,
}
