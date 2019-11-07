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
const truffleAssert = require('truffle-assertions');
const web3 = require('web3');
contract('User Contracts', accounts => {
    let instance;
    before(() => __awaiter(this, void 0, void 0, function* () {
        instance = yield NuclearPoE.deployed();
    }));
    it('REVERT: Create new user as non-owner', () => __awaiter(this, void 0, void 0, function* () {
        yield truffleAssert.reverts(instance.createUser(accounts[1], 0, web3.utils.fromAscii('NA-SA'), {
            from: accounts[1]
        }), 'Ownable: caller is not the owner.');
    }));
    it('Create user', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield instance.createUser(accounts[1], 0, web3.utils.fromAscii('NA-SA'));
        truffleAssert.eventEmitted(result, 'CreateUser');
    }));
    it('REVERT: Create duplicate user', () => __awaiter(this, void 0, void 0, function* () {
        yield truffleAssert.reverts(instance.createUser(accounts[1], 0, web3.utils.fromAscii('NA-SA')), 'User already created');
    }));
    it('Return user projects', () => __awaiter(this, void 0, void 0, function* () {
        yield truffleAssert.passes(instance.user(accounts[1]));
    }));
    it('EVENT: Change User Status', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield instance.changeUserStatus(accounts[1], {
            from: accounts[0]
        });
        truffleAssert.eventEmitted(result, 'ChangeUserStatus');
    }));
    it('REVERT: Change User Status of non existant user', () => __awaiter(this, void 0, void 0, function* () {
        yield truffleAssert.reverts(instance.changeUserStatus(accounts[7], {
            from: accounts[0]
        }), 'User does not exist or paused');
    }));
    it('REVERT: Change User Status as non owner', () => __awaiter(this, void 0, void 0, function* () {
        yield truffleAssert.reverts(instance.changeUserStatus(accounts[2], {
            from: accounts[1]
        }), 'Ownable: caller is not the owner.');
    }));
});
//# sourceMappingURL=NuclearPoE_User.js.map