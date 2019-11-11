"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { verifyToken, validateForm } = require('../config/index');
const router = express_1.default.Router({ mergeParams: true });
const rules = require('../config/validationRules');
const { create, confirm, restore, change, get, close, getOne, getBalance } = require('../controllers/UserController');
router.post('/', verifyToken, validateForm(rules.userCreate), create);
router.post('/confirm/:id', validateForm(rules.userConfirm), confirm);
router.post('/restore', validateForm(rules.userRestore), restore);
router.post('/change', verifyToken, validateForm(rules.userChange), change);
router.get('/get', get);
router.get('/getBalance/:address', validateForm(rules.userVerifyAddress), getBalance);
router.post('/close/:address', verifyToken, validateForm(rules.userClose), close);
router.get('/getOne/:address', validateForm(rules.userVerifyAddress), getOne);
module.exports = router;
//# sourceMappingURL=user.js.map