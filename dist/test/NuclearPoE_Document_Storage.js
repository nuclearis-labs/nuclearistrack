var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const NuclearPoE = artifacts.require('./contracts/NuclearPoE.sol');
const Process = artifacts.require('../contracts/Process.sol');
const assert = require('chai').assert;
const truffleAssert = require('truffle-assertions');
contract('Document Storage', accounts => {
    let instance;
    let processAddress;
    let processInstance;
    before(() => __awaiter(this, void 0, void 0, function* () {
        instance = yield NuclearPoE.deployed();
        yield instance.createUser(accounts[1], 0, web3.utils.asciiToHex('NA-SA'));
        yield instance.createUser(accounts[2], 1, web3.utils.asciiToHex('IMECO'));
        yield instance.createProject(41955, accounts[1], web3.utils.asciiToHex('Conjunto Soporte'), web3.utils.asciiToHex('234342 / 3453453'));
        const result = yield instance.createProcess(accounts[2], web3.utils.asciiToHex('Mecanizado'));
        processAddress = result.logs[0].args[0];
        processInstance = yield Process.at(processAddress);
        yield processInstance.addDocument('0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd', 12, 20, '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd', web3.utils.asciiToHex('-31,324234234'), web3.utils.asciiToHex('-54,324234234'), 'Este es un comentario', { from: accounts[2] });
    }));
    it('Find a document storage', () => __awaiter(this, void 0, void 0, function* () {
        let result = yield processInstance.getDocumentStorage('0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd');
        assert.equal(result[0], '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd');
    }));
    it('REVERT: Find a non-existent document storage', () => __awaiter(this, void 0, void 0, function* () {
        yield truffleAssert.reverts(processInstance.getDocumentStorage('0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'), 'Document does not exist');
    }));
});
//# sourceMappingURL=NuclearPoE_Document_Storage.js.map