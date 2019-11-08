var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import TransactionPrepare from '../classes/Transaction';
import { getKeys } from '../config/utils';
import web3 from '../config/web3';
import logger from '../config/winston';
export const transfer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { address, privateKey } = yield getKeys({
            email: req.body.email,
            passphrase: req.body.passphrase
        });
        const balance = yield web3.eth.getBalance(address);
        if (Number(web3.utils.fromWei(balance)) < Number(req.body.value)) {
            throw Error('Not sufficient funds');
        }
        const tx = new TransactionPrepare({ fromAddress: address });
        yield tx.estimateGas();
        yield tx.getNonce();
        tx.prepareRawTx({
            value: req.body.value,
            to: req.body.to,
            gaslimit: 4000000
        })
            .sign(privateKey)
            .serialize();
        const txHash = yield tx.send();
        logger.info(`Transfered ${req.body.value} to ${req.body.to} `, {
            txHash: txHash
        });
        res.json({ txHash });
    }
    catch (e) {
        logger.error(`Couldn't transfer ${req.body.value} to ${req.body.to} `, {
            message: e.message
        });
        res.status(400).json({ error: e.message });
    }
});
//# sourceMappingURL=TransferController.js.map