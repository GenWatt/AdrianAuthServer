import multer from 'multer'
import { USER_PROFILE_PATH } from '../constants'
import mkdirIfNotExists from '../utils/mkdirIfNotExists'
import { v4 } from 'uuid'

const userProfilePictureStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    mkdirIfNotExists(USER_PROFILE_PATH)
    cb(null, USER_PROFILE_PATH)
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1]
    const fileName = `${v4()}.${ext}`
    cb(null, fileName)
  },
})

export default userProfilePictureStorage
