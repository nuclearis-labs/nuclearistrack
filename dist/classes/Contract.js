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
/* eslint-disable no-await-in-loop */
require('dotenv').config();
const web3_1 = __importDefault(require("../config/web3"));
const Transaction_1 = __importDefault(require("./Transaction"));
const nuclearPoEABI = require('../../build/contracts/NuclearPoE.json').abi;
class Contract {
    constructor({ privateKey = Buffer.from('', 'hex'), abi = nuclearPoEABI, contractAddress = process.env.SCADDRESS } = {}) {
        this.abi = abi;
        this.privateKey = privateKey;
        this.contractAddress = contractAddress;
        this.instance = new web3_1.default.eth.Contract(abi, contractAddress);
    }
    getDataFromContract({ method, data }) {
        return __awaiter(this, void 0, void 0, function* () {
            const tx = new Transaction_1.default({ contract: this.instance, method, data });
            return yield tx.call();
        });
    }
    sendDataToContract({ fromAddress, method, data }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tx = new Transaction_1.default({
                    contract: this.instance,
                    fromAddress,
                    method,
                    data
                });
                tx.encodeABI();
                yield tx.estimateGas();
                yield tx.estimateGasLimit();
                yield tx.getNonce();
                tx.prepareRawTx()
                    .sign(this.privateKey)
                    .serialize();
                return yield tx.send();
            }
            catch (e) {
                throw Error(e);
            }
        });
    }
}
exports.default = Contract;
//# sourceMappingURL=Contract.js.map