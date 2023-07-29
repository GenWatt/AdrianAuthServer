import mongoose from 'mongoose'
import Database from './Database'
import { inject, injectable } from 'inversify'
import HttpError from '../errors/HttpError'

@injectable()
class AuthDatabase extends Database {
  private uri: string
  private connnectOptions: mongoose.ConnectOptions
  private session?: mongoose.mongo.ClientSession
  private db?: typeof mongoose

  constructor(
    @inject('uri') uri: string,
    @inject('connectOptions') connnectOptions?: mongoose.ConnectOptions
  ) {
    super()
    this.uri = uri
    this.connnectOptions = connnectOptions || {}
  }

  public getSession() {
    return this.session
  }

  public getSessionObject() {
    return { session: this.session }
  }

  public getDb() {
    return this.db
  }

  public async connect() {
    try {
      this.db = await mongoose.connect(this.uri, this.connnectOptions)
      this.session = await this.db.startSession()

      console.log('MongoDB connected!')
    } catch (err: any) {
      throw new HttpError(500, err.message)
    }
  }
}

export default AuthDatabase
