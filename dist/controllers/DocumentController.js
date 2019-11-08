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
const bs58_1 = __importDefault(require("bs58"));
const Contract_1 = __importDefault(require("../classes/Contract"));
const ipfs_1 = require("../config/ipfs");
const hash_1 = require("../config/hash");
const utils = __importStar(require("../config/utils"));
const pdf_1 = require("../config/pdf");
const winston_1 = __importDefault(require("../config/winston"));
const processABI = require('build/contracts/Process.json').abi;
module.exports.verify = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let documentHash;
    try {
        documentHash = hash_1.createSHA256(req.file.buffer);
        const contract = new Contract_1.default({
            abi: processABI,
            contractAddress: req.query.contract
        });
        const details = yield contract.getDataFromContract({
            method: 'getDocument',
            data: [documentHash]
        });
        res.json({
            docNumber: details[3],
            mineTime: details[4],
            latitude: utils.hexToAscii(details[1]),
            longitude: utils.hexToAscii(details[2]),
            documentHash,
            comment: details[5]
        });
    }
    catch (e) {
        winston_1.default.error(`Document could not be verified`, {
            hash: documentHash,
            contract: req.query.contract
        });
        res.status(404).json({ error: e.message });
    }
});
module.exports.upload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let documentHash;
    try {
        const { address, privateKey } = yield utils.getKeys(req.body);
        const latitude = utils.asciiToHex(req.body.latitude);
        const longitude = utils.asciiToHex(req.body.longitude);
        const contractAddress = utils.toChecksumAddress(req.query.contract);
        const NuclearPoEContract = new Contract_1.default();
        const rawDocNumber = yield NuclearPoEContract.getDataFromContract({
            method: 'docNumber'
        });
        const FileBufferWithDocNumber = yield pdf_1.addDocNumber({
            buffer: req.file.buffer,
            docNumber: `B-${rawDocNumber}`
        });
        documentHash = hash_1.createSHA256(FileBufferWithDocNumber);
        const storage = yield ipfs_1.saveToIPFS(FileBufferWithDocNumber);
        const hexStorage = bs58_1.default.decode(storage).toString('hex');
        const storageFunction = hexStorage.substr(0, 2);
        const storageSize = hexStorage.substr(2, 2);
        const storageHash = hexStorage.substr(4);
        const ProcessContract = new Contract_1.default({
            privateKey,
            abi: processABI,
            contractAddress
        });
        const txHash = yield ProcessContract.sendDataToContract({
            fromAddress: address,
            method: 'addDocument',
            data: [
                documentHash,
                Number(storageFunction),
                Number(storageSize),
                `0x${storageHash}`,
                latitude,
                longitude,
                req.body.comment
            ]
        });
        yield utils.createPendingTx({
            txHash,
            subject: 'add-document',
            data: [documentHash, `B-${rawDocNumber}`]
        });
        res.json(txHash);
    }
    catch (e) {
        winston_1.default.error(`Document could not be uploaded `, {
            documentHash
        });
        res.json({ error: e.message });
    }
});
module.exports.get = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contract = new Contract_1.default({
            abi: processABI,
            contractAddress: req.query.contract
        });
        const result = yield contract.getDataFromContract({
            method: 'getAllDocuments'
        });
        const documents = [];
        for (let i = 0; i < result.length; i++) {
            const details = yield contract.getDataFromContract({
                method: 'getDocument',
                data: [result[i]]
            });
            documents.push({
                docNumber: details[3],
                mineTime: details[4],
                latitude: utils.hexToAscii(details[1]),
                longitude: utils.hexToAscii(details[2]),
                documentHash: result[i]
            });
        }
        res.json(documents);
    }
    catch (e) {
        winston_1.default.error(`DocumentList could not be obtained `, {
            message: e.message
        });
        res.status(404).json({ error: e.message });
    }
});
module.exports.getOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contract = new Contract_1.default({
            abi: processABI,
            contractAddress: req.query.contract
        });
        const details = yield contract.getDataFromContract({
            method: 'getDocument',
            data: [req.query.hash]
        });
        const storageDetails = yield contract.getDataFromContract({
            method: 'getDocumentStorage',
            data: [req.query.hash]
        });
        const storageHash = bs58_1.default.encode(Buffer.from(storageDetails[1] + storageDetails[2] + storageDetails[0].substr(2), 'hex'));
        const file = yield ipfs_1.getFromIPFS(storageHash);
        res.json({
            docNumber: details[3],
            mineTime: details[4],
            latitude: utils.hexToAscii(details[1]),
            longitude: utils.hexToAscii(details[2]),
            documentHash: req.query.hash,
            storageHash,
            fileBuffer: file[0].content.toString('base64'),
            comment: details[5]
        });
    }
    catch (e) {
        winston_1.default.error(`Document ${req.query.hash} could not be obtained `, {
            message: e.message
        });
        res.status(404).json({ error: e.message });
    }
});
//# sourceMappingURL=DocumentController.js.map