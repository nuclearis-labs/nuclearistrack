/* eslint-disable no-await-in-loop */
/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable node/no-unpublished-require */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const NuclearPoE = artifacts.require('../contracts/NuclearPoE.sol');
const Process = artifacts.require('../contracts/Process.sol');
const { assert } = require('chai');
const truffleAssert = require('truffle-assertions');
const web3 = require('web3');
contract('Process', accounts => {
    let instance;
    let processAddress;
    let processInstance;
    before(() => __awaiter(this, void 0, void 0, function* () {
        instance = yield NuclearPoE.deployed();
        yield instance.createUser(accounts[1], 0, web3.utils.asciiToHex('NA-SA'));
        yield instance.createUser(accounts[2], 1, web3.utils.asciiToHex('IMECO'));
        yield instance.createProject(41955, accounts[1], web3.utils.asciiToHex('Conjunto Soporte'), web3.utils.asciiToHex('23423423 / 23423423'));
    }));
    it('REVERT: Create new process as non-owner', () => __awaiter(this, void 0, void 0, function* () {
        yield truffleAssert.reverts(instance.createProcess(accounts[2], web3.utils.asciiToHex('Mecanizado'), {
            from: accounts[1]
        }), 'Ownable: caller is not the owner.');
    }));
    it('EVENT: Add a process', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield instance.createProcess(accounts[2], web3.utils.asciiToHex('Mecanizado'));
        processAddress = result.logs[0].args[0];
        processInstance = yield Process.at(processAddress);
        truffleAssert.eventEmitted(result, 'CreateProcess');
    }));
    it('REVERT: Add a process with non-existing User', () => __awaiter(this, void 0, void 0, function* () {
        truffleAssert.reverts(instance.createProcess(accounts[3], web3.utils.asciiToHex('Mecanizado')), 'User does not exist');
    }));
    it('Get Process Details', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield processInstance.getDetails();
        assert(result[0], instance.address);
        assert(result[1], accounts[0]);
        assert(result[2], accounts[2]);
        assert(result[3], web3.utils.asciiToHex('Mecanizado'));
        assert(result[4], []);
        assert(result[5], processAddress);
    }));
    it('Get All Documents', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield processInstance.getAllDocuments();
        assert(result, []);
    }));
});
//# sourceMappingURL=NuclearPoE_Process.js.map