const express = require('express');
const { verifyToken, validateForm } = require('../middleware/index');

const router = express.Router({ mergeParams: true });
const rules = require('../services/validationRules');
const {
  create,
  confirm,
  restore,
  change,
  get,
  close,
  getOne,
  getBalance
} = require('../controller/UserController');

router.post('/', verifyToken, validateForm(rules.userCreate), create);

router.post('/confirm/:id', validateForm(rules.userConfirm), confirm);

router.post('/restore', validateForm(rules.userRestore), restore);

router.post('/change', verifyToken, validateForm(rules.userChange), change);

router.get('/get', get);

router.get(
  '/getBalance/:address',
  validateForm(rules.userVerifyAddress),
  getBalance
);

router.post(
  '/close/:address',
  verifyToken,
  validateForm(rules.userClose),
  close
);

router.get('/getOne/:address', validateForm(rules.userVerifyAddress), getOne);

module.exports = router;
