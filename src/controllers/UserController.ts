import { Router } from 'express'
import Controller from './Controller'
import Auth from '../middlewares/Auth'
import { Request, Response, NextFunction } from 'express'
import UserService from '../services/UserService'
import container from '../inversify.config'
import userProfilePictureMiddleware from '../middlewares/userProfilePictureMiddleware'
import { IUser } from '../types/types'

class UserController implements Controller {
  router: Router = Router()
  userServices: UserService = container.get<UserService>(UserService)

  constructor() {
    this.initializeRoutes()
  }

  public initializeRoutes() {
    this.router.get(
      '/profile',
      Auth.authenticateJwtAndRefreshToken,
      this.getProfile
    )
    this.router.put(
      '/profile-picture',
      Auth.authenticateJwtAndRefreshToken,
      userProfilePictureMiddleware,
      this.updateProfilePicture
    )
    this.router.put(
      '/deactivate',
      Auth.authenticateJwtAndRefreshToken,
      this.deactivateAccount
    )
    this.router.delete(
      '/delete-account',
      Auth.authenticateJwtAndRefreshToken,
      this.deleteAccount
    )
  }

  public deleteAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.userServices.deleteAccount(req.user as IUser, res)
      res.json({ success: true, message: 'Account deleted' })
    } catch (error) {
      next(error)
    }
  }

  public deactivateAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.userServices.deactivateAccount(req.user as IUser, res)
      res.json({ success: true, message: 'Account deactivated' })
    } catch (error) {
      next(error)
    }
  }

  public updateProfilePicture = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.json({
        success: true,
        message: 'Profile picture updated',
        profilePicture: req.file?.path,
      })
    } catch (error) {
      next(error)
    }
  }

  public getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.json({ user: req.user, success: true, message: 'User found' })
    } catch (error) {
      next(error)
    }
  }
}

export default UserController
