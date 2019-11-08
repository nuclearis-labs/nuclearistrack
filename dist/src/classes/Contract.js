var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/* eslint-disable no-await-in-loop */
require('dotenv').config();
import web3 from '../config/web3';
import Transaction from './Transaction';
const nuclearPoEABI = require('../build/contracts/NuclearPoE.json');
class Contract {
    constructor({ privateKey = undefined, abi = nuclearPoEABI, contractAddress = process.env.SCADDRESS } = {}) {
        this.abi = abi;
        this.privateKey = Buffer.from(privateKey, 'hex');
        this.contractAddress = contractAddress;
        this.instance = new web3.eth.Contract(abi, contractAddress);
    }
    /**
     * Creates a new Transaction Instance and invokes a call method on the contract.
     * @param  {String} method External View Contract Method to be called
     * @param  {String} arg Arguments to provide for call
     * @returns {Object} Result of contract method call
     */
    getDataFromContract({ method, data }) {
        return __awaiter(this, void 0, void 0, function* () {
            const tx = new Transaction({ contract: this.instance, method, data });
            return yield tx.call();
        });
    }
    sendDataToContract({ fromAddress, method, data }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tx = new Transaction({
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
export default Contract;
//# sourceMappingURL=Contract.js.map