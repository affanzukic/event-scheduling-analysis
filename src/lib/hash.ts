import crypto from 'crypto';

export const hashString = (s: string) =>
    crypto.createHash('sha256').update(s).digest('hex');

