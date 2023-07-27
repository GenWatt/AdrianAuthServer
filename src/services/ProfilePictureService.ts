import { injectable } from 'inversify'
import p from 'path'
import fs from 'fs'
import User from '../models/User'
import { IUser } from '../types/types'

@injectable()
class ProfilePictureService {
  public getStaticPath = (path: string) => {
    return `${process.env.BASE_URL}/${path
      .split('\\')
      .join('/')
      .replace('public/', '')}`
  }

  public getRelativePath = (path: string) => {
    return path.replace(
      `${process.env.BASE_URL}`,
      p.join(process.cwd(), '/public')
    )
  }

  public removeProfilePicture = async (user: IUser) => {
    const relativePath = this.getRelativePath(user.profilePicture)

    if (fs.existsSync(relativePath)) {
      fs.unlinkSync(relativePath)
    }

    await User.updateOne({ _id: user._id }, { profilePicture: '' })
  }
}

export default ProfilePictureService
