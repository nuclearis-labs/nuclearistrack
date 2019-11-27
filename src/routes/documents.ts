import express from 'express';
const multer = require('multer');
const upload = multer();

const { verifyToken, validateForm } = require('../config/index');
const rules = require('../config/validationRules');

const router = express.Router({ mergeParams: true });

const DocumentController = require('../controllers/DocumentController');

router.post(
  '/verify',
  upload.single('file'),
  validateForm(rules.documentVerify),
  DocumentController.verify
);

router.post(
  '/upload',
  verifyToken,
  upload.single('file'),
  validateForm(rules.documentUpload),
  DocumentController.upload
);

router.get('/get', DocumentController.get);

router.get(
  '/getOne',
  validateForm(rules.documentGetOne),
  DocumentController.getOne
);

module.exports = router;
