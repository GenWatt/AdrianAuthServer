import { Request, Response, NextFunction } from 'express'
import { IUser, UserBody } from '../types/types'
import { Router } from 'express'
import AuthService from '../services/AuthService'
import registerValidation from '../validators/registerValidation'
import validateMiddleware from '../middlewares/validateMiddleware'
import Controller from './Controller'
import container from '../inversify.config'
import TokenService from '../services/TokenService'
import HttpError from '../errors/HttpError'
import Auth from '../middlewares/Auth'

class AuthController implements Controller {
  public router = Router()
  private tokenManager: TokenService = container.get<TokenService>(TokenService)
  private AuthService: AuthService = container.get<AuthService>(AuthService)

  constructor() {
    this.initializeRoutes()
  }

  public initializeRoutes() {
    this.router.post(
      '/register',
      validateMiddleware(registerValidation),
      this.register
    )
    this.router.get('/confirm/:token', this.confirmEmail)
    this.router.post('/login', this.login)
    this.router.post(
      '/logout',
      Auth.authenticateJwtAndRefreshToken,
      this.logout
    )
    this.router.post('/reset-password', this.resetPaswsord)
    this.router.post('/new-password', this.newPassword)
  }

  public register = async (
    req: Request<{}, {}, UserBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      this.AuthService.register(req.body)
      res.json({ success: true })
    } catch (error: any) {
      next(error)
    }
  }

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { callbackUrl } = req.body
      const data = await this.AuthService.login(req.body)

      req.user = data.user

      if (!data.accessToken)
        return res.json({ success: false, message: 'No access token' })

      this.tokenManager.saveAccessTokenToCookie(res, data.accessToken)

      if (callbackUrl) {
        return res.redirect(`${callbackUrl}`)
      }

      res.json({ user: req.user, success: true, message: 'Logged in' })
    } catch (error) {
      next(error)
    }
  }

  public confirmEmail = async (
    req: Request<{ token: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      this.AuthService.confirmEmail(req.params.token)
      res.redirect(`${process.env.AUTH_CLIENT_URL}/login`)
    } catch (error) {
      next(error)
    }
  }

  public logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.AuthService.logout(req.user as IUser, res)
      res.json({ success: true, message: 'Logged out' })
    } catch (error) {
      next(error)
    }
  }

  public resetPaswsord = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body

      this.AuthService.resetPassword(email)

      res.end()
    } catch (error) {
      next(error)
    }
  }

  public newPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { password, confirmPassword } = req.body
    const { token } = req.query

    try {
      if (!token) throw new HttpError(400, 'No token provided')

      if (password !== confirmPassword) {
        throw new HttpError(400, 'Passwords do not match')
      }

      if (typeof token !== 'string') {
        throw new HttpError(400, 'Invalid token')
      }

      await this.AuthService.newPassword(token, password)

      res.json({ success: true, message: 'Password changed successfully' })
    } catch (error) {
      next(error)
    }
  }
}

export default AuthController
