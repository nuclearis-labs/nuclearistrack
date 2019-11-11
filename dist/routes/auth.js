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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
const index_1 = require("../config/index");
const user_1 = __importDefault(require("../models/user"));
const wallet = __importStar(require("../config/wallet"));
const validationRules_1 = __importDefault(require("../config/validationRules"));
router.post('/', index_1.validateForm(validationRules_1.default.auth), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findOne({ email: req.body.email });
        const decryptedKey = yield wallet.decryptBIP38(user.encryptedPrivateKey, req.body.passphrase);
        const address = wallet.generateRSKAddress(decryptedKey);
        if (user.address === address) {
            jsonwebtoken_1.default.sign({
                userName: user.username,
                userEmail: user.email,
                userType: user.type,
                address: user.address
            }, process.env.JWT_SECRET, (err, encoded) => {
                if (err)
                    throw Error();
                else
                    res.json({ encoded });
            });
        }
    }
    catch (e) {
        console.log(e);
        res.sendStatus(403);
    }
}));
router.post('/current', index_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bearer = req.headers.authorization.split(' ');
    const bearerToken = bearer[1];
    try {
        const authData = jsonwebtoken_1.default.verify(bearerToken, process.env.JWT_SECRET);
        res.json(authData);
    }
    catch (e) {
        res.json({});
    }
}));
module.exports = router;
//# sourceMappingURL=auth.js.map