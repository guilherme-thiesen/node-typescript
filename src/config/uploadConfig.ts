import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const pathDirectory = path.resolve(__dirname, '..', '..', 'tmp');
export default {
  directory: pathDirectory,
  storage: multer.diskStorage({
    destination: pathDirectory,
    filename(request, file, callback) {
      const filehash = crypto.randomBytes(10).toString('HEX');
      const filename = `${filehash}-${file.originalname}`;

      return callback(null, filename);
    },
  }),
};
