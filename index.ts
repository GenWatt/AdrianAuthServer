import 'reflect-metadata'
import express from 'express'
import dontenv from 'dotenv'
dontenv.config()
import services from './src/inversify.config'
import globalError from './src/errors/globalError'
import path from 'path'
import AuthDatabase from './src/db/AuthDatabase'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import Controller from './src/controllers/Controller'
import controllers from './src/controllers/controllers'
import helmet from 'helmet'

class Server {
  private app: express.Application = express()
  private port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000
  private corsList: string[] = [process.env.AUTH_CLIENT_URL!]
  private controllers: Controller[] = controllers
  private authDatabase: AuthDatabase

  constructor() {
    this.authDatabase = services.container.resolve<AuthDatabase>(AuthDatabase)
  }

  public initMiddlewares(): void {
    this.app.use(
      helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } })
    )
    this.app.use(cookieParser())
    this.app.use(cors({ origin: this.corsList, credentials: true }))
    this.app.use(express.static(path.join(__dirname, 'public')))
    this.app.use(express.json({ limit: '10kb' }))
    this.app.use(express.urlencoded({ extended: true, limit: '2mb' }))
    this.authDatabase.connect()
    this.controllers.forEach((controller) => {
      this.app.use('/', controller.router)
    })

    // Global error handler
    this.app.use(globalError)
  }

  public start(): void {
    this.initMiddlewares()
    this.app.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`)
    })
  }
}

const server = new Server()

server.start()
