import * as stream from 'stream';
import { Request } from 'express';
import FormData from 'form-data';

export interface IUserOnReq extends Request {
  user?: any;
}
export interface IFileOnReq extends Request {
  file?: { buffer: Buffer; stream: any };
}
