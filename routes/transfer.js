const express = require('express');
const { verifyToken, validateForm } = require('../middleware/index');
const rules = require('../services/validationRules');
const { transfer } = require('../controller/TransferController');
const router = express.Router({ mergeParams: true });

router.post('/', verifyToken, validateForm(rules.transfer), transfer);

module.exports = router;
