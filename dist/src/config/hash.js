import { createHash } from 'crypto';
export const createSHA256 = (buffer) => {
    return `0x${createHash('sha256')
        .update(buffer)
        .digest('hex')}`;
};
//# sourceMappingURL=hash.js.map