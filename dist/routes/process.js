"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { verifyToken, validateForm } = require('../../middleware/index');
const router = express_1.default.Router({ mergeParams: true });
const rules = require('../../services/validationRules');
const ProcessController = require('../controller/ProcessController');
router.post('/', verifyToken, validateForm(rules.processCreate), ProcessController.create);
router.get('/getOne', validateForm({
    'params.contract': 'required|checksumAddress'
}), ProcessController.getOne);
router.get('/getByExpediente', validateForm({
    expediente: 'required|integer'
}), ProcessController.getByID);
router.get('/get', verifyToken, ProcessController.get);
module.exports = router;
//# sourceMappingURL=process.js.map