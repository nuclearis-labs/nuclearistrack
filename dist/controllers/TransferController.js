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
const Transaction = require('../classes/Transaction');
const { getKeys } = require('../functions/utils');
const web3 = require('../services/web3');
const winston_1 = __importDefault(require("../config/winston"));
module.exports.transfer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { address, privateKey } = yield getKeys({
            email: req.body.email,
            passphrase: req.body.passphrase,
            coin: process.env.DEVIATIONCOIN
        });
        const balance = yield web3.eth.getBalance(address);
        if (Number(web3.utils.fromWei(balance)) < Number(req.body.value)) {
            throw Error('Not sufficient funds');
        }
        const tx = new Transaction({ fromAddress: address });
        yield tx.estimateGas();
        yield tx.getNonce();
        tx.prepareRawTx({
            value: req.body.value,
            to: req.body.to,
            gaslimit: 4000000
        })
            .sign(Buffer.from(privateKey, 'hex'))
            .serialize();
        const txHash = yield tx.send();
        winston_1.default.info(`Transfered ${req.body.value} to ${req.body.to} `, {
            txHash: txHash
        });
        res.json({ txHash });
    }
    catch (e) {
        winston_1.default.error(`Couldn't transfer ${req.body.value} to ${req.body.to} `, {
            message: e.message
        });
        res.status(400).json({ error: e.message });
    }
});
//# sourceMappingURL=TransferController.js.map