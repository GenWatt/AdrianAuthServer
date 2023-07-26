import multer from 'multer'
import { USER_PROFILE_PATH } from '../constants'
import mkdirIfNotExists from '../utils/mkdirIfNotExists'

const userProfilePictureStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    mkdirIfNotExists(USER_PROFILE_PATH)
    cb(null, USER_PROFILE_PATH)
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname}`
    cb(null, fileName)
  },
})

export default userProfilePictureStorage
