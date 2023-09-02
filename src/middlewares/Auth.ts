import { Request, Response, NextFunction } from 'express'
import cookieExtractor from '../utils/cookieExtractor'
import User from '../models/User'
import container from '../inversify.config'
import TokenService from '../services/TokenService'
import HttpError from '../errors/HttpError'
import { Types } from 'mongoose'
class Auth {
  static async authenticateJwt(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const tokenService = container.get<TokenService>(TokenService)
      // validate token
      const decodedToken = tokenService.verifyAccessToken(cookieExtractor(req))
      if (!decodedToken?.isValid) {
        return next()
      }

      const user = await User.findOne({
        _id: decodedToken._id,
        isLogged: true,
        active: true,
      })

      if (!user) {
        return next(new HttpError(401, 'Unauthorized'))
      }

      req.user = user

      next()
    } catch (error) {
      next(error)
    }
  }

  static async updateUser(id: Types.ObjectId, refreshToken?: string, isLogged: boolean = true) {
    await User.updateOne(
      { _id: id },
      { refreshToken, isLogged: isLogged }
    )
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    const tokenService = container.get<TokenService>(TokenService)

    if (!req.user) {
      try {
        // check if user is log in and have valid refresh token
        const decodedToken = tokenService.verifyAccessToken(
          cookieExtractor(req)
        )

        if (!decodedToken) {
          return next(new HttpError(401, 'Unauthorized'))
        }

        const user = await User.findOne({
          _id: decodedToken._id,
          isLogged: true,
          active: true,
        })

        if (!user) {
          return next(new HttpError(401, 'Unauthorized'))
        }

        // verify refresh token
        const decodedRefreshToken = tokenService.verifyRefreshToken(
          user.refreshToken
        )

        if (!decodedRefreshToken?.isValid) {
          Auth.updateUser(user._id, undefined, false)
          return next(new HttpError(401, 'Unauthorized'))
        }

        // create new access token
        const { accessToken, refreshToken } =
          tokenService.createAccessAndRefreshToken(user)

        tokenService.saveAccessTokenToCookie(res, accessToken)

        // update user refresh token
        Auth.updateUser(user._id, refreshToken)

        req.user = user

        return next()
      } catch (error) {
        next(error)
      }
    }

    next()
  }
  static authenticateJwtAndRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    Auth.authenticateJwt(req, res, () => {
      Auth.refreshToken(req, res, next)
    })
  }
}

export default Auth
