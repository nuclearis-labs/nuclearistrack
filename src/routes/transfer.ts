import express from 'express';
import { verifyToken, validateForm } from '../config/index';
import rules from '../config/validationRules';
import { transfer } from '../controllers/TransferController';
const router = express.Router({ mergeParams: true });

router.post('/', verifyToken, validateForm(rules.transfer), transfer);

module.exports = router;
