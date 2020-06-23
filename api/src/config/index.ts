import jwt from 'jsonwebtoken';
import niv from './Validator';
import { Response, Request, NextFunction } from 'express';
import { IUserOnReq, AuthData } from '../types/Custom';

export function verifyToken(
  req: IUserOnReq,
  res: Response,
  next: NextFunction
) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');

    const bearerToken = bearer[1];
    try {
      req.user = jwt.verify(bearerToken, process.env.JWT_SECRET) as AuthData;
      next();
    } catch (e) {
      res.sendStatus(403);
    }
  } else res.sendStatus(403);
}

export function validateForm(rules: object) {
  return (req: Request, res: Response, next: NextFunction) => {
    const v = new niv.Validator(
      { body: req.body, params: req.params, query: req.query },
      rules
    );

    v.check().then(matched => {
      if (!matched) {
        res.status(400).send(v.errors);
      } else {
        next();
      }
    });
  };
}
