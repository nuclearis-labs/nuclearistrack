import crypto from 'crypto';
import fs from 'fs';
import zlib from 'zlib';

import getCipherKey from './getCipherKey';

export default function decrypt({ file, password }) {
  const readInitVect = fs.createReadStream(file, { end: 15 });

  let initVect;
  readInitVect.on('data', chunk => {
    initVect = chunk;
  });

  readInitVect.on('close', () => {
    const cipherKey = getCipherKey(password);
    const readStream = fs.createReadStream(file, { start: 16 });
    const decipher = crypto.createDecipheriv('aes256', cipherKey, initVect);
    const unzip = zlib.createUnzip();
    const writeStream = fs.createWriteStream(file + '.unenc');

    readStream.on('error', () => {
      fs.unlinkSync(file + '.unenc');

      throw Error('Error in reading the file');
    });
    decipher.on('error', () => {
      fs.unlinkSync(file + '.unenc');

      throw Error('Error in deciphering the file');
    });
    unzip.on('error', () => {
      fs.unlinkSync(file + '.unenc');

      throw Error('Error in unziping the file');
    });
    writeStream.on('error', () => {
      throw Error('Error in writing the file');
    });

    readStream
      .pipe(decipher)
      .pipe(unzip)
      .pipe(writeStream);
  });
}
