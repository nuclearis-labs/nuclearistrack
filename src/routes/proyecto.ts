import express from 'express';
const { verifyToken, validateForm } = require('../config/index');
const rules = require('../config/validationRules');
const {
  create,
  getDocNumber,
  get,
  close,
  getOne,
  assignProcess
} = require('../controllers/ProjectController');
const router = express.Router({ mergeParams: true });

router.post('/', verifyToken, validateForm(rules.projectCreate), create);

router.get('/getDocNumber', verifyToken, getDocNumber);

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