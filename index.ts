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
import mkdirIfNotExists from './src/utils/mkdirIfNotExists'
import rateLimit from 'express-rate-limit'
import env from './src/validators/envValidation'
import Migration from './src/migrations'

class Server {
  private app: express.Application = express()
  private port: number = env.PORT
  private corsList: string[] = [
    process.env.AUTH_CLIENT_URL!,
    process.env.ADRIAN_TUBE_URL!,
  ]
  private controllers: Controller[] = controllers
  private authDatabase: AuthDatabase
  private migration: Migration = new Migration()

  constructor() {
    this.authDatabase = services.container.resolve<AuthDatabase>(AuthDatabase)
  }

  public initMiddlewares(): void {
    console.log(process.env.AUTH_CLIENT_URL)
    this.app.set('trust proxy', 1)
    this.app.use(
      helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } })
    )
    this.app.use(
      rateLimit({
        windowMs: 5 * 60 * 1000,
        max: 150,
        standardHeaders: true,
      })
    )
    this.createDirs()
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

  private createDirs(): void {
    const dirs = ['public', 'public/images', 'public/images/profile']
    dirs.forEach((dir) => {
      mkdirIfNotExists(dir)
    })
  }

  public start(): void {
    this.migration.runMigrations()
    this.initMiddlewares()
    this.app.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`)
    })
  }
}

const server = new Server()

server.start()
