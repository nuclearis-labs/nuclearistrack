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
const user_1 = __importDefault(require("../models/user"));
const utils = __importStar(require("../config/utils"));
const wallet = __importStar(require("../config/wallet"));
const transaction_1 = __importDefault(require("../models/transaction"));
const web3_1 = __importDefault(require("../config/web3"));
const Contract_1 = __importDefault(require("../classes/Contract"));
const winston_1 = __importDefault(require("../config/winston"));
module.exports.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield user_1.default.create({
            username: req.body.newUserName,
            email: req.body.newUserEmail,
            type: req.body.userType
        });
        winston_1.default.info(`User ${db._id} created {"email":${req.body.newUserEmail}}`);
        res.status(200).json({ userID: db._id });
    }
    catch (e) {
        winston_1.default.error(`User ${req.body.newUserEmail} Creation didn't worked out `, {
            message: e.message
        });
        res.status(400).json({ error: e.message });
    }
});
module.exports.confirm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user;
    try {
        const user = yield user_1.default.findOne({
            _id: req.params.id,
            address: null
        });
        const mnemonic = wallet.newMnemonic();
        const newPrivateKey = yield wallet.generatePrivateKeyFromMnemonic({
            mnemonic,
            coin: process.env.DERIVATIONPATHCOIN
        });
        const encryptedNewPrivateKey = wallet.encryptBIP38(newPrivateKey, req.body.passphrase);
        const newAddress = wallet.generateRSKAddress(newPrivateKey);
        const { address, privateKey } = yield utils.getKeys({
            email: process.env.ADMINEMAIL,
            passphrase: process.env.ADMINPASSPHRASE
        });
        const contract = new Contract_1.default({ privateKey });
        const txHash = yield contract.sendDataToContract({
            fromAddress: address,
            method: 'createUser',
            data: [newAddress, user.type, utils.asciiToHex(user.username)]
        });
        yield utils.createPendingTx({
            txHash,
            subject: 'add-user',
            data: [user.username, user.type, newAddress]
        });
        const db = yield user_1.default.findByIdAndUpdate(req.params.id, {
            address: newAddress,
            encryptedPrivateKey: encryptedNewPrivateKey
        }, { new: true });
        winston_1.default.info(`User ${user._id} confirmed {"address":${newAddress}}`);
        res.json({
            username: db.username,
            email: db.email,
            mnemonic,
            address: db.address,
            txHash
        });
    }
    catch (e) {
        winston_1.default.error(`User Confirmation: `, { message: e.message });
        console.log(e);
        res.status(500).json({ error: e.message });
    }
});
exports.restore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user;
    try {
        const newPrivateKey = yield wallet.generatePrivateKeyFromMnemonic({
            mnemonic: req.body.mnemonic,
            coin: process.env.DERIVATIONPATHCOIN
        });
        const newEncryptedPrivateKey = wallet.encryptBIP38(newPrivateKey, req.body.newPassphrase);
        const newAddress = wallet.generateRSKAddress(newPrivateKey);
        user = yield user_1.default.findOneAndUpdate({ address: newAddress }, {
            encryptedPrivateKey: newEncryptedPrivateKey
        }, { new: true });
        if (!user) {
            throw Error('No user with this mnemonic');
        }
        winston_1.default.info(`User ${user._id} restored with mnemonic passphrase`);
        res.json(user);
    }
    catch (e) {
        winston_1.default.error(`User not able to restore with mnemonic passphrase`, {
            message: e.message
        });
        res.status(400).json({ error: e.message });
    }
});
module.exports.change = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user;
    try {
        const user = yield user_1.default.findOne({
            email: req.body.email,
            address: { $ne: null }
        });
        const decryptedKey = yield wallet.decryptBIP38(user.encryptedPrivateKey, req.body.passphrase);
        const encryptedPrivateKey = wallet.encryptBIP38(decryptedKey, req.body.newPassphrase);
        yield user_1.default.findByIdAndUpdate(user._id, {
            encryptedPrivateKey
        });
        winston_1.default.info(`User ${user._id} changed passphrase`);
        res.sendStatus(200);
    }
    catch (e) {
        winston_1.default.error(`User not able to change passphrase`, {
            error: e.message
        });
        res.status(400).json({ error: e.message });
    }
});
module.exports.get = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contract = new Contract_1.default();
        const contractUsers = yield contract.getDataFromContract({
            method: 'getAllUsers'
        });
        yield transaction_1.default.deleteMany({ data: { $in: contractUsers } });
        const pendingUser = yield transaction_1.default.aggregate([
            {
                $match: {
                    subject: 'add-user'
                }
            },
            {
                $group: {
                    _id: null,
                    result: { $push: { $arrayElemAt: ['$data', 2] } }
                }
            }
        ]);
        const allUsers = Object.values(contractUsers).concat(pendingUser.length > 0 ? pendingUser[0]['result'] : []);
        const allUsersDetails = allUsers.map((address) => __awaiter(void 0, void 0, void 0, function* () {
            const details = yield contract.getDataFromContract({
                method: 'getUserDetails',
                data: [address]
            });
            return {
                name: utils.hexToAscii(details[0]),
                type: details[1],
                status: details[2],
                address
            };
        }));
        Promise.all(allUsersDetails).then(userDetails => {
            res.json(userDetails);
        });
    }
    catch (e) {
        console.log(e);
        winston_1.default.error(`Couldn't retrieve userList`, { message: e.message });
        res.status(500).json({ error: e.message });
    }
});
module.exports.getBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        web3_1.default.eth.getBalance(req.params.address).then(balance => {
            res.json(web3_1.default.utils.fromWei(balance));
        });
    }
    catch (e) {
        winston_1.default.error(`Couldn't get balance of ${req.params.address} `, {
            message: e.message
        });
        res.sendStatus(500);
    }
});
module.exports.close = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { address, privateKey } = yield utils.getKeys(req.body);
        const contract = new Contract_1.default({ privateKey });
        const txHash = yield contract.sendDataToContract({
            fromAddress: address,
            method: 'changeUserStatus',
            data: [req.params.address]
        });
        winston_1.default.info(`Paused User ${req.params.address}`);
        res.json(txHash);
    }
    catch (e) {
        winston_1.default.error(`Couldn't pause User ${req.params.address}`, {
            message: e.message
        });
        res.status(400).json({ error: e.message });
    }
});
module.exports.getOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const address = utils.toChecksumAddress(req.params.address);
        const contract = new Contract_1.default();
        yield user_1.default.findOneAndUpdate({ address }, { status: true });
        const userDetails = yield contract.getDataFromContract({
            method: 'getUserDetails',
            data: [address]
        });
        const projects = yield contract.getDataFromContract({
            method: userDetails[1] == 0 ? 'getClientProjects' : 'getSupplierProjects',
            data: [address]
        });
        let response = [];
        let balance = yield web3_1.default.eth.getBalance(address);
        for (let i = 0; i < projects.length; i++) {
            let projectDetails = yield contract.getDataFromContract({
                method: 'getProjectDetails',
                data: [projects[i]]
            });
            response.push({
                title: utils.hexToAscii(projectDetails[2]),
                expediente: projects[i],
                oc: utils.hexToAscii(projectDetails[3])
            });
        }
        res.json({
            userName: utils.hexToAscii(userDetails[0]),
            balance: web3_1.default.utils.fromWei(balance),
            type: userDetails[1],
            status: userDetails[2],
            proyectos: response
        });
    }
    catch (e) {
        winston_1.default.error(`Couldn't get user details ${req.params.address}`, {
            message: e.message
        });
        res.status(500).json({ error: e.message });
    }
});
//# sourceMappingURL=UserController.js.map