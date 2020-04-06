import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

import { AppendInitVect } from './appendInitVector';
import getCipherKey from './getCipherKey';

export default function encrypt({ file, password }) {
  const initVect = crypto.randomBytes(16);

  const CIPHER_KEY = getCipherKey(password);
  const readStream = fs.createReadStream(file);
  const gzip = zlib.createGzip();
  const cipher = crypto.createCipheriv('aes256', CIPHER_KEY, initVect);
  const appendInitVect = new AppendInitVect(initVect);
  const writeStream = fs.createWriteStream(path.join(file + '.enc'));

  readStream
    .pipe(gzip)
    .pipe(cipher)
    .pipe(appendInitVect)
    .pipe(writeStream);
}
