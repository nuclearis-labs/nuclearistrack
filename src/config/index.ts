import jwt from 'jsonwebtoken';
import niv from '../config/Validator.js';
import { Response, Request, NextFunction } from 'express';

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    try {
      const authData = jwt.verify(bearerToken, process.env.JWT_SECRET);
      req.user = authData;
      next();
    } catch (e) {
      res.sendStatus(403);
    }
  } else res.sendStatus(403);
};

export const validateForm = (rules: object) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const v = new niv.Validator(
      { body: req.body, params: req.params, query: req.query },
      rules
    );

    v.check().then(matched => {
      if (!matched) {
        res.status(422).send(v.errors);
      } else {
        next();
      }
    });
  };
};
