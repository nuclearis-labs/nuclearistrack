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
const ethereumjs_tx_1 = require("ethereumjs-tx");
const web3_1 = __importDefault(require("../config/web3"));
class Transaction {
    constructor({ fromAddress, contract, method, data }) {
        this.contract = contract;
        this.method = method;
        this.arg = data || [];
        this.fromAddress = fromAddress;
    }
    encodeABI() {
        this.data = this.contract.methods[this.method](...this.arg).encodeABI();
        return this;
    }
    call() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.contract.methods[this.method](...this.arg).call();
            }
            catch (e) {
                throw Error(e);
            }
        });
    }
    estimateGas() {
        return __awaiter(this, void 0, void 0, function* () {
            this.gasprice = yield web3_1.default.eth.getGasPrice();
            return this;
        });
    }
    estimateGasLimit() {
        return __awaiter(this, void 0, void 0, function* () {
            this.gaslimit = yield this.contract.methods[this.method](...this.arg).estimateGas({
                from: this.fromAddress
            });
            return this;
        });
    }
    getNonce() {
        return __awaiter(this, void 0, void 0, function* () {
            this.nonce = yield web3_1.default.eth.getTransactionCount(this.fromAddress);
            return this;
        });
    }
    /**
     * Prepares
     * @param {ethTx} tx Instance of ethTx Class
     * @param {Buffer} privateKey Private Key of user
     * @returns {ethTx} Signed Transaction Instance
     */
    prepareRawTx({ value = '0', to = this.contract.options.address, gaslimit = this.gaslimit } = {}) {
        let weiValue = web3_1.default.utils.toWei(value, 'ether');
        const txParams = {
            nonce: web3_1.default.utils.toHex(this.nonce),
            gasPrice: web3_1.default.utils.toHex(this.gasprice),
            gasLimit: web3_1.default.utils.toHex(gaslimit),
            to: to,
            value: web3_1.default.utils.toHex(weiValue),
            data: this.data
        };
        this.tx = new ethereumjs_tx_1.Transaction(txParams);
        return this;
    }
    /**
     * Sign Transaction Instance
     * @param {ethTx} tx Instance of ethTx Class
     * @param {Buffer} privateKey Private Key of user
     * @returns {ethTx} Signed Transaction Instance
     */
    sign(privateKey) {
        this.tx.sign(privateKey);
        return this;
    }
    serialize() {
        this.serializedTx = this.tx.serialize();
        return this;
    }
    send() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                web3_1.default.eth.sendSignedTransaction(`0x${this.serializedTx.toString('hex')}`, (err, result) => {
                    if (err)
                        reject(err);
                    resolve(result);
                });
            });
        });
    }
}
exports.default = Transaction;
//# sourceMappingURL=Transaction.js.map