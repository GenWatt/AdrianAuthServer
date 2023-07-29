import AuthController from './AuthController'
import UserController from './UserController'
import UserSettingsController from './UserSettingsController'

const controllers = [
  new AuthController(),
  new UserController(),
  new UserSettingsController(),
]

export default controllers
