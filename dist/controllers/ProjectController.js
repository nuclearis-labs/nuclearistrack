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
const Contract_1 = __importDefault(require("../classes/Contract"));
const utils = __importStar(require("../config/utils"));
const transaction_1 = __importDefault(require("../models/transaction"));
const winston_1 = __importDefault(require("../config/winston"));
exports.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { address, privateKey } = yield utils.getKeys(req.body);
        const nuclear = new Contract_1.default({ privateKey });
        const oc = utils.asciiToHex(req.body.oc);
        const projectTitle = utils.asciiToHex(req.body.proyectoTitle);
        const txHash = yield nuclear.sendDataToContract({
            fromAddress: address,
            method: 'createProject',
            data: [req.body.expediente, req.body.clientAddress, projectTitle, oc]
        });
        yield utils.createPendingTx({
            txHash,
            subject: 'add-project',
            data: [
                req.body.proyectoTitle,
                req.body.clientAddress,
                req.body.expediente,
                req.body.oc
            ]
        });
        winston_1.default.info(`Project ${req.body.expediente} created`);
        res.json(txHash);
    }
    catch (e) {
        winston_1.default.error(`Project ${req.body.expediente} was not created`);
        res.status(500).json({ error: e.message });
    }
});
exports.getDocNumber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contract = new Contract_1.default();
        const result = yield contract.getDataFromContract({ method: 'docNumber' });
        res.json(result);
    }
    catch (e) {
        winston_1.default.error(`Doc Number could not be retrieved `, { message: e.message });
        res.json({ error: e.message });
    }
});
exports.get = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contract = new Contract_1.default();
        const contractProjects = yield contract.getDataFromContract({
            method: 'getAllProjects'
        });
        yield transaction_1.default.deleteMany({ data: { $in: contractProjects } });
        const pendingProjects = yield transaction_1.default.aggregate([
            {
                $match: {
                    subject: 'add-project'
                }
            },
            {
                $group: {
                    _id: null,
                    result: { $push: { $arrayElemAt: ['$data', 2] } }
                }
            }
        ]);
        const allProjects = Object.values(contractProjects).concat(pendingProjects.length > 0 ? pendingProjects[0]['result'] : []);
        const allProjectsDetails = allProjects.map((id) => __awaiter(void 0, void 0, void 0, function* () {
            const details = yield contract.getDataFromContract({
                method: 'getProjectDetails',
                data: [id]
            });
            if (details[1] === req.user.address ||
                req.user.address === process.env.ADMINADDRESS)
                return {
                    status: details[0],
                    clientAddress: details[1],
                    clientName: utils.hexToAscii(details[2]),
                    title: utils.hexToAscii(details[3]),
                    oc: utils.hexToAscii(details[4]),
                    processContracts: details[5],
                    id
                };
            return {};
        }));
        Promise.all(allProjectsDetails).then(projectDetails => {
            res.json(projectDetails);
        });
    }
    catch (e) {
        winston_1.default.error(`ProjectList could not be obtained `, { message: e.message });
        res.status(500).json({ error: e.message });
    }
});
exports.close = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { address, privateKey } = yield utils.getKeys(req.body);
        const contract = new Contract_1.default({ privateKey });
        const txHash = yield contract.sendDataToContract({
            fromAddress: address,
            method: 'changeProjectStatus',
            data: [req.params.expediente]
        });
        winston_1.default.info(`Project ${req.params.expediente} closed`);
        res.json(txHash);
    }
    catch (e) {
        winston_1.default.error(`Project could not be closed `, { message: e.message });
        res.status(400).json({ error: e.message });
    }
});
exports.getOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contract = new Contract_1.default();
        const result = yield contract.getDataFromContract({
            method: 'getProjectDetails',
            data: [req.query.expediente]
        });
        res.json({
            active: result[0],
            clientName: utils.hexToAscii(result[2]),
            clientAddress: result[1],
            expediente: req.query.expediente,
            title: utils.hexToAscii(result[3]),
            oc: utils.hexToAscii(result[4]),
            processContracts: result[5]
        });
    }
    catch (e) {
        winston_1.default.error(`Project ${req.query.expediente} could not be obtained `, {
            message: e.message
        });
        res.json({ error: e.message });
    }
});
exports.assignProcess = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { address, privateKey } = yield utils.getKeys(req.body);
        const contract = new Contract_1.default({ privateKey });
        const txHash = yield contract.sendDataToContract({
            fromAddress: address,
            method: 'addProcessToProject',
            data: [Number(req.body.expediente), req.body.processContract]
        });
        yield utils.createPendingTx({
            txHash,
            subject: 'assign-process',
            data: [req.body.expediente, req.body.processContract]
        });
        winston_1.default.info(`Process ${req.body.processContract} was assigned to project ${req.body.expediente} `);
        res.json(txHash);
    }
    catch (e) {
        winston_1.default.error(`Process ${req.body.processContract} could not be assigned to project ${req.body.expediente} `, { message: e.message });
        res.json({ error: e.message });
    }
});
//# sourceMappingURL=ProjectController.js.map