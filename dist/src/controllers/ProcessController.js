var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Contract from '../classes/Contract';
import * as utils from '../config/utils';
import txModel from '../models/transaction';
import logger from '../config/winston';
const processABI = require('build/contracts/Process.json').abi;
module.exports.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { address, privateKey } = yield utils.getKeys(req.body);
        const processTitle = utils.asciiToHex(req.body.processTitle);
        const supplierAddress = utils.toChecksumAddress(req.body.supplierAddress);
        const contract = new Contract({
            privateKey
        });
        const txHash = yield contract.sendDataToContract({
            fromAddress: address,
            method: 'createProcess',
            data: [supplierAddress, processTitle]
        });
        yield utils.createPendingTx({
            txHash,
            subject: 'add-process',
            data: [req.body.processTitle, supplierAddress]
        });
        logger.info(`Process created `, {
            title: req.body.processTitle,
            supplier: req.body.supplierAddress
        });
        res.json(txHash);
    }
    catch (e) {
        logger.error(`Process was not created`, {
            title: req.body.processTitle,
            supplier: req.body.supplierAddress
        });
        res.status(500).json({ error: e.message });
    }
});
module.exports.getOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contract = new Contract();
        const process = new Contract({
            abi: processABI,
            contractAddress: req.query.contract
        });
        const details = yield process.getDataFromContract({
            method: 'getDetails'
        });
        const userName = yield contract.getDataFromContract({
            method: 'getUserDetails',
            data: [details[1]]
        });
        res.json({
            NuclearPoEAddress: details[0],
            supplierAddress: details[1],
            supplierName: utils.hexToAscii(userName[0]),
            processName: utils.hexToAscii(details[2]),
            allDocuments: details[3],
            contractAddress: details[4]
        });
    }
    catch (e) {
        logger.error(`Process ${req.query.contract} could not be obtained `, {
            message: e.message
        });
        res.json({ error: e.message });
    }
});
module.exports.getByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contract = new Contract();
        const processContractsByExpediente = yield contract.getDataFromContract({
            method: 'getProcessContractsByProject',
            data: [req.query.expediente]
        });
        const AssignmentDetails = processContractsByExpediente.map((processContractAddress) => __awaiter(void 0, void 0, void 0, function* () {
            const process = new Contract({
                abi: processABI,
                contractAddress: processContractAddress
            });
            const details = yield process.getDataFromContract({
                method: 'getDetails'
            });
            const userName = yield contract.getDataFromContract({
                method: 'getUserDetails',
                data: [details[1]]
            });
            return {
                NuclearPoEAddress: details[0],
                supplierAddress: details[1],
                supplierName: utils.hexToAscii(userName[0]),
                processName: utils.hexToAscii(details[2]),
                allDocuments: details[3],
                contractAddress: details[4]
            };
        }));
        Promise.all(AssignmentDetails).then(details => {
            res.json(details);
        });
    }
    catch (e) {
        logger.error(`ProcessListByID could not be obtained `, {
            message: e.message
        });
        res.json({ error: e.message });
    }
});
module.exports.get = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contract = new Contract();
        const processContracts = yield contract.getDataFromContract({
            method: 'getAllProcessContracts'
        });
        const allProcessDetails = processContracts.map((address) => __awaiter(void 0, void 0, void 0, function* () {
            const processContract = new Contract({
                abi: processABI,
                contractAddress: address
            });
            const details = yield processContract.getDataFromContract({
                method: 'getDetails'
            });
            yield txModel.deleteMany({
                subject: 'add-process',
                data: { $in: details[1] }
            });
            const userName = yield contract.getDataFromContract({
                method: 'getUserDetails',
                data: [details[1]]
            });
            if (details[1] === req.user.address ||
                req.user.address === process.env.ADMINADDRESS)
                return {
                    supplierAddress: details[1],
                    supplierName: utils.hexToAscii(userName[0]),
                    processName: utils.hexToAscii(details[2]),
                    allDocuments: details[3],
                    processContracts: details[4]
                };
            return {};
        }));
        const pendingTx = yield txModel.find({ subject: 'add-process' });
        Promise.all(allProcessDetails).then(processDetails => {
            res.json(processDetails.concat(pendingTx));
        });
    }
    catch (e) {
        logger.error(`ProcessList could not be obtained `, { message: e.message });
        res.json({ error: e.message });
    }
});
//# sourceMappingURL=ProcessController.js.map