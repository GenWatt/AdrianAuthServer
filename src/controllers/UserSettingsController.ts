import { Router } from 'express'
import Controller from './Controller'
import { Request, Response, NextFunction } from 'express'
import { IUSerSettings, IUser } from '../types/types'
import Auth from '../middlewares/Auth'
import UserSettingsService from '../services/UserSettingsService'
import services from '../inversify.config'
import validateMiddleware from '../middlewares/validateMiddleware'
import userSettingsValidation from '../validators/userSettingsValidation'

class UserSettingsController implements Controller {
  private userSettingsService: UserSettingsService =
    services.get<UserSettingsService>(UserSettingsService)
  router: Router = Router()

  public initializeRoutes(): void {
    this.router.get(
      '/user-settings',
      Auth.authenticateJwtAndRefreshToken,
      this.getUserSettings
    )

    this.router.put(
      '/user-settings',
      Auth.authenticateJwtAndRefreshToken,
      validateMiddleware(userSettingsValidation),
      this.updateUserSettings
    )
  }

  constructor() {
    this.initializeRoutes()
  }

  private getUserSettings = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = req.user as IUser
      const userSettings = await this.userSettingsService.getUserSettings(user)

      res.status(200).json({
        userSettings,
        success: true,
        message: `${req.user.username} settings fetched successfully`,
      })
    } catch (error) {
      next(error)
    }
  }

  private updateUserSettings = async (
    req: Request<{}, {}, IUSerSettings>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log(req.body)
      const updatedUserSettings =
        await this.userSettingsService.updateUserSettings(req.user, req.body)

      res.status(200).json({
        userSettings: updatedUserSettings,
        success: true,
        message: 'Your preferances were successfully updated',
      })
    } catch (error) {
      next(error)
    }
  }
}

export default UserSettingsController
