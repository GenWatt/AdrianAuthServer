import { Types } from 'mongoose'
import { Request } from 'express'

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

interface IUserRequest extends Request {
  user?: IUser
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
  IUserRequest,
}
