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
require('dotenv').config();
const ethereumjs_util_1 = require("ethereumjs-util");
const utils_1 = require("./utils");
const wif_1 = __importDefault(require("wif"));
const bip38 = __importStar(require("bip38"));
const bitcoinjs_lib_1 = require("bitcoinjs-lib");
const bip39 = __importStar(require("bip39"));
const bip32 = __importStar(require("bip32"));
const assert_1 = require("assert");
function generateWifPrivateKey(privKey, network = bitcoinjs_lib_1.networks.testnet.wif) {
    return wif_1.default.encode(network, privKey, true);
}
function encryptBIP38(privKey, passphrase) {
    const decoded = wif_1.default.decode(generateWifPrivateKey(privKey), bitcoinjs_lib_1.networks.testnet.wif);
    return bip38.encrypt(decoded.privateKey, decoded.compressed, passphrase);
}
exports.encryptBIP38 = encryptBIP38;
function decryptBIP38(encryptedKey, passphrase) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { privateKey } = bip38.decrypt(encryptedKey, passphrase);
            return privateKey;
        }
        catch (e) {
            console.log(e.message);
            if (e instanceof assert_1.AssertionError) {
                throw Error('Passphrase or User incorrect');
            }
        }
    });
}
exports.decryptBIP38 = decryptBIP38;
function newMnemonic() {
    return bip39.generateMnemonic();
}
exports.newMnemonic = newMnemonic;
function generatePrivateKeyFromMnemonic({ mnemonic, coin = '0', account = 0, index = 0 }) {
    return __awaiter(this, void 0, void 0, function* () {
        const seed = yield bip39.mnemonicToSeed(mnemonic);
        const node = bip32.fromSeed(seed);
        return node.derivePath(`m/44'/${coin}'/${account}'/0/${index}`).privateKey;
    });
}
exports.generatePrivateKeyFromMnemonic = generatePrivateKeyFromMnemonic;
function generateRSKAddress(privateKey) {
    try {
        return utils_1.toChecksumAddress(ethereumjs_util_1.privateToAddress(privateKey).toString('hex'));
    }
    catch (e) {
        console.log(e);
    }
}
exports.generateRSKAddress = generateRSKAddress;
//# sourceMappingURL=wallet.js.map