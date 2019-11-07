"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const jwt = require('jsonwebtoken');
const { verifyToken, validateForm } = require('../../middleware/index');
const UserModel = require('../models/user');
const wallet = require('../../functions/wallet');
const rules = require('../../services/validationRules');
router.post('/', validateForm(rules.auth), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserModel.findOne({ email: req.body.email });
        const decryptedKey = yield wallet.decryptBIP38(user.encryptedPrivateKey, req.body.passphrase);
        address = wallet.generateRSKAddress(decryptedKey);
        if (user.address === address) {
            jwt.sign({
                userName: user.username,
                userEmail: user.email,
                userType: user.type,
                address: user.address
            }, process.env.JWT_SECRET, (err, token) => {
                if (err)
                    throw Error();
                else
                    res.json({ token });
            });
        }
    }
    catch (e) {
        console.log(e);
        res.sendStatus(403);
    }
}));
router.post('/current', verifyToken, validateForm({
    authorization: 'required'
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bearer = req.headers.authorization.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    try {
        const authData = jwt.verify(req.token, process.env.JWT_SECRET);
        res.json(authData);
    }
    catch (e) {
        res.json({});
    }
}));
module.exports = router;
//# sourceMappingURL=auth.js.map