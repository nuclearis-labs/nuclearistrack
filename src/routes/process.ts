import express from 'express';

const { verifyToken, validateForm } = require('../config/index');
const router = express.Router({ mergeParams: true });
const rules = require('../config/validationRules');
const ProcessController = require('../controllers/ProcessController');

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

module.exports = router;
