var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const fs = require('fs');
const { saveToIPFS, getFromIPFS } = require('../../services/ipfs');
const { createSHA256 } = require('../../functions/hash');
const toBeType = require('jest-tobetype');
expect.extend(toBeType);
const file = { buffer: fs.readFileSync('./LICENSE') };
const desiredHashOutput = '0xc7e211ac55da7975448d2d722ba995b764e0bd1860878c41e1762468d3d98a04';
let docHash;
describe('Hash Functions', () => {
    test('Should return a valid SHA256 Hash with Hex Prefix', () => {
        docHash = createSHA256(file.buffer);
        expect(docHash).toBe(desiredHashOutput);
    });
});
let storageHash;
describe('IPFS File Storage', () => {
    test('Should upload the file as stream to Swarm', () => __awaiter(this, void 0, void 0, function* () {
        storageHash = yield saveToIPFS(file.buffer);
        expect(storageHash).toBeType('string');
    }));
    test('Should download the file and read the content into a buffer', () => __awaiter(this, void 0, void 0, function* () {
        const buffer = yield getFromIPFS(storageHash);
        expect(buffer);
    }));
});
//# sourceMappingURL=document.test.js.map