"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { verifyToken, validateForm } = require('../config/index');
const rules = require('../config/validationRules');
const { transfer } = require('../controllers/TransferController');
const router = express_1.default.Router({ mergeParams: true });
router.post('/', verifyToken, validateForm(rules.transfer), transfer);
module.exports = router;
//# sourceMappingURL=transfer.js.map