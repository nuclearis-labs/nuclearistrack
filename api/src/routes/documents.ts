import express from 'express';
import multer from 'multer';
import * as DocumentController from '../controllers/DocumentController';
import { verifyToken, validateForm } from '../config/index';
import rules from '../config/validationRules';

const router = express.Router({ mergeParams: true });

router.post(
  '/verify',
  validateForm(rules.documentVerify),
  DocumentController.verify
);

router.post(
  '/upload',
  verifyToken,
  validateForm(rules.documentUpload),
  DocumentController.upload
);

router.get('/get', DocumentController.get);

router.get(
  '/getOne',
  validateForm(rules.documentGetOne),
  DocumentController.getOne
);

export default router;
