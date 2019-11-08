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
require('dotenv').config();
const ethereumjs_util_1 = __importDefault(require("ethereumjs-util"));
const utils_1 = require("./utils");
const wif_1 = __importDefault(require("wif"));
const bip38_1 = __importDefault(require("bip38"));
const bitcoinjs_lib_1 = require("bitcoinjs-lib");
const bip39_1 = __importDefault(require("bip39"));
const bip32_1 = __importDefault(require("bip32"));
const assert_1 = require("assert");
const generateWifPrivateKey = (privKey, network = bitcoinjs_lib_1.networks.testnet.wif) => {
    return wif_1.default.encode(network, privKey, true);
};
exports.encryptBIP38 = (privKey, passphrase) => {
    const decoded = wif_1.default.decode(generateWifPrivateKey(privKey), bitcoinjs_lib_1.networks.testnet.wif);
    return bip38_1.default.encrypt(decoded.privateKey, decoded.compressed, passphrase);
};
exports.decryptBIP38 = (encryptedKey, passphrase) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { privateKey } = bip38_1.default.decrypt(encryptedKey, passphrase);
        return privateKey;
    }
    catch (e) {
        console.log(e.message);
        if (e instanceof assert_1.AssertionError) {
            throw Error('Passphrase or User incorrect');
        }
    }
});
exports.generateMnemonic = (strength = 256) => {
    return bip39_1.default.generateMnemonic(strength);
};
exports.generatePrivateKeyFromMnemonic = ({ mnemonic, coin = '0', account = 0, index = 0 }) => __awaiter(void 0, void 0, void 0, function* () {
    const seed = yield bip39_1.default.mnemonicToSeed(mnemonic);
    const node = bip32_1.default.fromSeed(seed);
    return node.derivePath(`m/44'/${coin}'/${account}'/0/${index}`).privateKey;
});
exports.generateRSKAddress = (privateKey) => {
    try {
        return utils_1.toChecksumAddress(ethereumjs_util_1.default.privateToAddress(privateKey).toString('hex'));
    }
    catch (e) {
        console.log(e);
    }
};
exports.toHex = (input) => {
    return input.toString('hex');
};
//# sourceMappingURL=wallet.js.map