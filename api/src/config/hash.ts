import { createHash } from 'crypto';

export function createSHA256(buffer: Buffer): string {
  return `0x${createHash('sha256')
    .update(buffer)
    .digest('hex')}`;
}
