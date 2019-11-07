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
contract('Create Project', accounts => {
    let instance;
    before(() => __awaiter(this, void 0, void 0, function* () {
        instance = yield NuclearPoE.deployed();
    }));
    it('EVENT: Create a new project', () => __awaiter(this, void 0, void 0, function* () {
        yield instance.createUser(accounts[1], 0, web3.utils.asciiToHex('NA-SA'));
        const result = yield instance.createProject(41955, accounts[1], web3.utils.asciiToHex('Conjunto Soporte'), web3.utils.asciiToHex('23423423 / 23423423'));
        truffleAssert.eventEmitted(result, 'CreateProject');
    }));
    it('REVERT: Create duplicate project', () => __awaiter(this, void 0, void 0, function* () {
        yield truffleAssert.reverts(instance.createProject(41955, accounts[1], web3.utils.asciiToHex('Conjunto Soporte'), web3.utils.asciiToHex('23423423 / 23423423')), 'Project already created');
    }));
    it('REVERT: Create project with non-existing User', () => __awaiter(this, void 0, void 0, function* () {
        yield truffleAssert.reverts(instance.createProject(54322, accounts[4], web3.utils.asciiToHex('Conjunto Soporte'), web3.utils.asciiToHex('23423423 / 23423423')), 'User does not exist');
    }));
    it('REVERT: Create new project as non-owner', () => __awaiter(this, void 0, void 0, function* () {
        yield truffleAssert.reverts(instance.createProject(41955, accounts[1], web3.utils.asciiToHex('Conjunto Soporte'), web3.utils.asciiToHex('23423423 / 23423423'), { from: accounts[1] }), 'Ownable: caller is not the owner.');
    }));
});
contract('Return Projects', accounts => {
    let instance;
    before(() => __awaiter(this, void 0, void 0, function* () {
        instance = yield NuclearPoE.deployed();
        yield instance.createUser(accounts[1], 0, web3.utils.asciiToHex('NA-SA'));
        yield instance.createUser(accounts[2], 1, web3.utils.asciiToHex('IMECO'));
        yield instance.createProject(41955, accounts[1], web3.utils.asciiToHex('Conjunto Soporte'), web3.utils.asciiToHex('23423423 / 23423423'));
        yield instance.createProject(41800, accounts[1], web3.utils.asciiToHex('Anillos 2019'), web3.utils.asciiToHex('23423423 / 23423423'));
    }));
    it('Return projects contracts', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield instance.getAllProjects();
        assert.lengthOf(result, 2, 'Result should be array of 2 projects');
    }));
});
contract('Close Project', accounts => {
    let instance;
    before(() => __awaiter(this, void 0, void 0, function* () {
        instance = yield NuclearPoE.deployed();
        yield instance.createUser(accounts[1], 0, web3.utils.asciiToHex('NA-SA'));
        yield instance.createUser(accounts[2], 1, web3.utils.asciiToHex('IMECO'));
        yield instance.createProject(41955, accounts[1], web3.utils.asciiToHex('Conjunto Soporte'), web3.utils.asciiToHex('23423423 / 23423423'));
        yield instance.createProject(41956, accounts[1], web3.utils.asciiToHex('Conjunto Soporte'), web3.utils.asciiToHex('23423423 / 23423423'));
    }));
    it('EVENT: Close Project', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield instance.changeProjectStatus(41955, {
            from: accounts[0]
        });
        truffleAssert.eventEmitted(result, 'CloseProject');
    }));
    it('REVERT: Close non existant Project', () => __awaiter(this, void 0, void 0, function* () {
        yield truffleAssert.reverts(instance.changeProjectStatus(12333, {
            from: accounts[0]
        }), 'Project does not exist or is already closed');
    }));
    it('REVERT: Close already closed Project', () => __awaiter(this, void 0, void 0, function* () {
        yield instance.changeProjectStatus(41956, {
            from: accounts[0]
        });
        yield truffleAssert.reverts(instance.changeProjectStatus(41956, {
            from: accounts[0]
        }), 'Project does not exist or is already closed');
    }));
});
contract('Doc Number', accounts => {
    let instance;
    let processAddress;
    before(() => __awaiter(this, void 0, void 0, function* () {
        instance = yield NuclearPoE.deployed();
        yield instance.createUser(accounts[1], 0, web3.utils.asciiToHex('NA-SA'));
        yield instance.createUser(accounts[2], 1, web3.utils.asciiToHex('IMECO'));
        yield instance.createProject(41955, accounts[1], web3.utils.asciiToHex('Conjunto Soporte'), web3.utils.asciiToHex('23423423 / 23423423'));
        const result = yield instance.createProcess(accounts[2], web3.utils.asciiToHex('Mecanizado'));
        processAddress = result.logs[0].args[0];
        processInstance = yield Process.at(processAddress);
    }));
    it('Get Doc Number', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield instance.docNumber();
        assert(result, 0);
    }));
});
//# sourceMappingURL=NuclearPoE_Project.js.map