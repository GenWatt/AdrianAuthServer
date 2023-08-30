import multer from 'multer';
import userCoverPictureStorage from '../storages/userCoverPictureStorage';
import HttpError from '../errors/HttpError';
import User from '../models/User';
import { NextFunction, Request, Response } from 'express';
import { IUser } from '../types/types';
import container from '../inversify.config';
import FileService from '../services/FileService';

const uplaodCoverPicture = multer({
    storage: userCoverPictureStorage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extName = fileTypes.test(file.originalname.toLowerCase().split('.').pop() || '');
        const mimeType = fileTypes.test(file.mimetype);
        if (extName && mimeType) {
            return cb(null, true);
        }
        cb(new HttpError(400, 'Only jpeg, jpg and png are allowed'));
    }
});

const userCoverPictureMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const fileService = container.get<FileService>(
          FileService
        )
        uplaodCoverPicture.single('coverPicture')(req, res, async (err) => {
          if (err instanceof multer.MulterError) {
            return next(new HttpError(400, err.message))
          }
    
          if (err) {
            return next(err)
          }

          if (!req.file) {
            return next(new HttpError(400, 'No file'))
          }
    
          await fileService.removeCoverPicture(req.user as IUser)
    
          const fullPath = fileService.getStaticPath(req.file?.path)
    
          await User.updateOne(
            { _id: (req.user as IUser)._id },
            {
              coverPicture: fullPath,
            }
          )
    
          next()
        })
      } catch (error) {
        next(error)
      }
}

export default userCoverPictureMiddleware;