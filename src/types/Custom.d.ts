import { Request } from 'express';

export interface IUserOnReq extends Request {
  user?: {
    userName: string;
    userEmail: string;
    address: string;
    roles: Object;
  };
}

export interface AuthData {
  userName: string;
  userEmail: string;
  address: string;
  roles: Object;
}

export interface IFileOnReq extends Request {
  file?: {
    buffer: Buffer;
    originalName: string;
    detectedFileExtension: string;
    stream: any;
  };
}
