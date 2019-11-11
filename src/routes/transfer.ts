import express from 'express';
const { verifyToken, validateForm } = require('../config/index');
const rules = require('../config/validationRules');
const { transfer } = require('../controllers/TransferController');
const router = express.Router({ mergeParams: true });

router.post('/', verifyToken, validateForm(rules.transfer), transfer);

module.exports = router;
