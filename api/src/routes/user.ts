import express from 'express';
import { verifyToken, validateForm } from '../config/index';
import rules from '../config/validationRules';
import * as UserController from '../controllers/UserController';
const router = express.Router({ mergeParams: true });

router.post(
  '/',
  verifyToken,
  validateForm(rules.userCreate),
  UserController.create
);

router.post(
  '/confirm/:id',
  validateForm(rules.userConfirm),
  UserController.confirm
);

router.post(
  '/restore',
  verifyToken,
  validateForm(rules.userRestore),
  UserController.restore
);

router.post(
  '/change',
  verifyToken,
  validateForm(rules.userChange),
  UserController.change
);

router.get('/get', UserController.get);

router.get('/check/:address/:role', UserController.checkRole);

router.get(
  '/getBalance/:address',
  validateForm(rules.userVerifyAddress),
  UserController.getBalance
);

router.get(
  '/getOne/:address',
  validateForm(rules.userVerifyAddress),
  UserController.getOne
);

export default router;
