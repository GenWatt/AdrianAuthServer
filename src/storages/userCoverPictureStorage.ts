import multer from 'multer';
import mkdirIfNotExists from '../utils/mkdirIfNotExists';
import { USER_COVER_PATH } from '../constants';
import { v4 } from 'uuid';

const userCoverPictureStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        mkdirIfNotExists(USER_COVER_PATH)
        cb(null, USER_COVER_PATH);
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        const fileName = `${v4()}.${ext}`
        cb(null, fileName)
    },
});

export default userCoverPictureStorage;