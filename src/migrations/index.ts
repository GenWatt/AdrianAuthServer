import setUsersSettings from './setUsersSettings'
import MigrationModel from '../models/Migration'
import HttpError from '../errors/HttpError'

class Migration {
  public migrations: Function[] = [setUsersSettings]

  public runMigration = async (migration: Function) => {
    try {
      const migrationExists = await MigrationModel.exists({
        name: migration.name,
        done: true,
      })

      if (!migrationExists) {
        await migration()

        const migrationName = migration.name
        console.log(`Migration ${migrationName} done`)
        await MigrationModel.create({ name: migrationName, done: true })
      }
    } catch (error: any) {
      throw new HttpError(500, error.message)
    }
  }

  public runMigrations = () => {
    this.migrations.forEach(this.runMigration)
  }
}

export default Migration
