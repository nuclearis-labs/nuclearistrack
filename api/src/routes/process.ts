import express from 'express';
import { verifyToken, validateForm } from '../config/index';
import rules from '../config/validationRules';

import * as ProcessController from '../controllers/ProcessController';

const router = express.Router({ mergeParams: true });

router.post(
  '/',
  verifyToken,
  validateForm(rules.processCreate),
  ProcessController.create
);

router.get(
  '/getOne',
  validateForm({
    'query.contract': 'required|checksumAddress'
  }),
  ProcessController.getOne
);

router.get(
  '/getByExpediente',
  validateForm({
    'query.expediente': 'required|integer'
  }),
  ProcessController.getByID
);

router.get('/get', verifyToken, ProcessController.get);

export default router;
