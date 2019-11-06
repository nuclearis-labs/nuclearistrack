const express = require('express');
const storage = require('multer').memoryStorage();
const upload = require('multer')({ storage });

const { verifyToken, validateForm } = require('../middleware/index');
const rules = require('../services/validationRules');

const router = express.Router({ mergeParams: true });

const DocumentController = require('../controller/DocumentController');

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
