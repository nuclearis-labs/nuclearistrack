declare namespace Express {
  export interface Request {
    user?: any;
    file?: { buffer: Buffer };
  }
}
