import { Container, interfaces } from 'inversify'
import AuthService from './services/AuthService'
import TokenService from './services/TokenService'
import AuthDatabase from './db/AuthDatabase'
import UserService from './services/UserService'
import mongoose from 'mongoose'

class ServicesContainer {
  public container = new Container()
  public loadServices(): void {
    this.container.bind<string>('uri').toConstantValue(process.env.MONGODB_URI!)
    this.container
      .bind<mongoose.ConnectOptions>('connectOptions')
      .toConstantValue({})

    this.container.bind<AuthService>(AuthService).toSelf().inSingletonScope()
    this.container.bind<TokenService>(TokenService).toSelf().inSingletonScope()
    this.container.bind<AuthDatabase>(AuthDatabase).toSelf().inSingletonScope()
    this.container.bind<UserService>(UserService).toSelf().inSingletonScope()
  }

  public get<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>): T {
    return this.container.get<T>(serviceIdentifier)
  }
}

const services = new ServicesContainer()

services.loadServices()

export default services
