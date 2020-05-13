import express from 'express';
import { verifyToken, validateForm } from '../config/index';
import rules from '../config/validationRules';
import {
  create,
  get,
  close,
  getOne,
  assignProcess
} from '../controllers/ProjectController';

const router = express.Router({ mergeParams: true });

router.post('/', verifyToken, validateForm(rules.projectCreate), create);

router.get('/get', verifyToken, get);

router.post(
  '/close/:expediente',
  verifyToken,
  validateForm(rules.projectClose),
  close
);

router.get('/getOne', verifyToken, validateForm(rules.projectGetOne), getOne);

router.post(
  '/assignProcess',
  verifyToken,
  validateForm(rules.projectAssignProcess),
  assignProcess
);

module.exports = router;
