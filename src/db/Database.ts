import { injectable } from 'inversify'

@injectable()
class Database {
  public async connect() {
    throw new Error('Database connection not implemented')
  }
}

export default Database
