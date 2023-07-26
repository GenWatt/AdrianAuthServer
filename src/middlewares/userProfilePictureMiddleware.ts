import { Request, Response, NextFunction } from 'express'
import multer from 'multer'
import HttpError from '../errors/HttpError'
import userProfilePictureStorage from '../storages/userProfileStorage'
import User from '../models/User'
import { IUser } from '../types/types'
import fs from 'fs'
import path from 'path'

const uploadPicture = multer({
  storage: userProfilePictureStorage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/

    const extName = fileTypes.test(
      file.originalname.toLowerCase().split('.').pop() || ''
    )
    const mimeType = fileTypes.test(file.mimetype)
    if (extName && mimeType) {
      return cb(null, true)
    }
    cb(new HttpError(400, 'Only jpeg, jpg and png are allowed'))
  },
})

const userProfilePictureMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    uploadPicture.single('profilePicture')(req, res, async (err) => {
      if (err) {
        return next(err)
      }

      const profilePicture = (req.user as IUser).profilePicture.replace(
        `${process.env.BASE_URL}`,
        path.join(process.cwd(), '/public')
      )

      // remove old profile picture
      if (profilePicture) {
        if (fs.existsSync(profilePicture)) {
          fs.unlinkSync(profilePicture)
        }

        await User.updateOne(
          { _id: (req.user as IUser)._id },
          { profilePicture: '' }
        )
      }

      const fullPath = `${process.env.BASE_URL}/${req.file?.path
        .split('\\')
        .join('/')
        .replace('public/', '')}`

      await User.updateOne(
        { _id: (req.user as IUser)._id },
        {
          profilePicture: fullPath,
        }
      )

      next()
    })
  } catch (error) {
    next(error)
  }
}

export default userProfilePictureMiddleware
