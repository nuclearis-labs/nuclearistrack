var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const wallet = require('../functions/wallet.js');
const toBeType = require('jest-tobetype');
expect.extend(toBeType);
let mnemonic;
let privateKey;
let passphrase = 'Password';
let encryptedKey;
let decryptedKey;
let rskAddress;
describe('Wallet Generation Functions', () => {
    test('Should generate a Mnemonic Pasphrase', () => {
        mnemonic = wallet.generateMnemonic();
        expect(mnemonic).toBeType('string');
    });
    test('Should generate a Private Key from the Mnemonic Passphrase', () => __awaiter(this, void 0, void 0, function* () {
        privateKey = yield wallet.generatePrivateKeyFromMnemonic(mnemonic);
        expect(privateKey).toBeType('object');
    }));
    test('Should generate a new RSK Address', () => {
        rskAddress = wallet.generateRSKAddress(privateKey);
        expect(rskAddress).toBeType('string');
        expect(rskAddress.toString('hex')).toHaveLength(42);
    });
});
describe('Wallet Encryption', () => {
    test('Should encrypt a WIF Private Key', () => {
        encryptedKey = wallet.encryptBIP38(privateKey, passphrase);
        expect(encryptedKey).toBeType('string');
        expect(encryptedKey).toHaveLength(58);
    });
    test('Should decrypt a BIP38 encoded key', () => __awaiter(this, void 0, void 0, function* () {
        decryptedKey = yield wallet.decryptBIP38(encryptedKey, passphrase);
        let decryptedKeyString = decryptedKey.toString('hex');
        expect(decryptedKeyString).toBeType('string');
        expect(decryptedKeyString).toHaveLength(64);
    }));
});
//# sourceMappingURL=wallet.test.js.map