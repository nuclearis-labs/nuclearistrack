import crypto from 'crypto';

export default function getCipherKey(password) {
  return crypto
    .createHash('sha256')
    .update(password)
    .digest();
}
