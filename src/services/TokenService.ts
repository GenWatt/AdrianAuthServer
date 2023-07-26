import jwt from 'jsonwebtoken'
import {
  IDecodedToken,
  LoginData,
  IUser,
  IDecodedResetToken,
  IDecodedConfirmToken,
} from '../types/types'
import { Response } from 'express'
import { injectable } from 'inversify'

@injectable()
class TokenService {
  public createPayload(user: IUser) {
    const payload = {
      _id: user._id,
      username: user.username,
      email: user.email,
    }

    return payload
  }

  public createAccessToken(user: IUser) {
    const token = jwt.sign(
      this.createPayload(user),
      process.env.JWT_SECRET_KEY!,
      {
        expiresIn: '10s',
      }
    )
    return token
  }

  public createRefreshToken(user: IUser) {
    const token = jwt.sign(
      this.createPayload(user),
      process.env.JWT_REFRESH_KEY!,
      {
        expiresIn: '1d',
      }
    )
    return token
  }

  public createConfirmationToken(email: string) {
    const token = jwt.sign(
      { type: 'confirm', email },
      process.env.JWT_CONFIRM_KEY!,
      {
        expiresIn: '20m',
      }
    )
    return token
  }

  public createAccessAndRefreshToken(user: IUser): LoginData {
    const accessToken = this.createAccessToken(user)
    const refreshToken = this.createRefreshToken(user)
    return { accessToken, refreshToken }
  }

  public verifyAccessToken(token: string): IDecodedToken | null {
    try {
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY!
      ) as Exclude<IDecodedToken, 'isValid'>
      return { ...decodedToken, isValid: true } as IDecodedToken
    } catch (err) {
      return {
        ...(jwt.decode(token) as Exclude<IDecodedToken, 'isValid'>),
        isValid: false,
      } as IDecodedToken
    }
  }

  public verifyRefreshToken(token: string): IDecodedToken | null {
    try {
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_REFRESH_KEY!
      ) as Exclude<IDecodedToken, 'isValid'>
      return { ...decodedToken, isValid: true } as IDecodedToken
    } catch (err) {
      return {
        ...(jwt.decode(token) as Exclude<IDecodedToken, 'isValid'>),
        isValid: false,
      } as IDecodedToken
    }
  }

  public saveAccessTokenToCookie(res: Response, token: string) {
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60,
      sameSite: 'none',
    })
  }

  public createResetToken(email: string) {
    const token = jwt.sign(
      { type: 'reset', email },
      process.env.JWT_RESET_KEY!,
      {
        expiresIn: '20m',
      }
    )
    return token
  }

  public verifyResetToken(token: string): IDecodedResetToken | null {
    try {
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_RESET_KEY!
      ) as IDecodedResetToken
      return { ...decodedToken } as IDecodedResetToken
    } catch (err) {
      return {
        ...(jwt.decode(token) as IDecodedResetToken),
        isValid: false,
      } as IDecodedResetToken
    }
  }

  public verifyConfirmationToken(token: string): IDecodedConfirmToken | null {
    try {
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_CONFIRM_KEY!
      ) as IDecodedConfirmToken
      return { ...decodedToken, isValid: true } as IDecodedConfirmToken
    } catch (err) {
      return {
        ...(jwt.decode(token) as IDecodedConfirmToken),
        isValid: false,
      } as IDecodedConfirmToken
    }
  }
}

export default TokenService
