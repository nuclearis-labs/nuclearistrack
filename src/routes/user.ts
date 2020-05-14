import express from 'express';
import { verifyToken, validateForm } from '../config/index';
import rules from '../config/validationRules';
import {
  create,
  confirm,
  restore,
  change,
  get,
  checkRole,
  getOne,
  getBalance
} from '../controllers/UserController';
const router = express.Router({ mergeParams: true });

router.post('/', verifyToken, validateForm(rules.userCreate), create);

router.post('/confirm/:id', validateForm(rules.userConfirm), confirm);

router.post('/restore', verifyToken, validateForm(rules.userRestore), restore);

router.post('/change', verifyToken, validateForm(rules.userChange), change);

router.get('/get', get);

router.get('/check/:address/:role', checkRole);

router.get(
  '/getBalance/:address',
  validateForm(rules.userVerifyAddress),
  getBalance
);

router.get('/getOne/:address', validateForm(rules.userVerifyAddress), getOne);

module.exports = router;
