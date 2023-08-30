import { Request, Response, NextFunction } from 'express'
import multer from 'multer'
import HttpError from '../errors/HttpError'
import userProfilePictureStorage from '../storages/userProfileStorage'
import User from '../models/User'
import { IUser } from '../types/types'
import container from '../inversify.config'
import FileService from '../services/FileService'

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
    const fileService = container.get<FileService>(
      FileService
    )
    uploadPicture.single('profilePicture')(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return next(new HttpError(400, err.message))
      }
      
      if (err) {
        return next(err)
      }

      if (!req.file) {
        return next(new HttpError(400, 'No file'))
      }

      await fileService.removeProfilePicture(req.user as IUser)

      const fullPath = fileService.getStaticPath(req.file?.path)

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
