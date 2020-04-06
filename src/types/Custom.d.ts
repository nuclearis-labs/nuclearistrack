import { Request } from 'express';

export interface IUserOnReq extends Request {
  user?: {
    userName: string;
    userEmail: string;
    address: string;
    roles: Object;
  };
}
export interface IFileOnReq extends Request {
  file?: { buffer: Buffer; stream: any };
}
