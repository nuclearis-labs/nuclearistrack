/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable node/no-unpublished-require */

const NuclearPoE = artifacts.require('../contracts/NuclearPoE.sol');
const User = artifacts.require('../contracts/User.sol');
const { assert } = require('chai');
const truffleAssert = require('truffle-assertions');

const web3 = require('web3');

contract('User Contracts', accounts => {
  let instance;
  let userInstance;
  before(async () => {
    instance = await NuclearPoE.deployed();
  });

  it('REVERT: Create new user as non-owner', async () => {
    await truffleAssert.reverts(
      instance.createUser(accounts[1], web3.utils.fromAscii('NA-SA'), 0, {
        from: accounts[1]
      }),
      'Only owner can make this change'
    );
  });

  it('Create user', async () => {
    const result = await instance.createUser(
      accounts[1],
      web3.utils.fromAscii('NA-SA'),
      0
    );
    userInstance = await User.at(result.logs[0].args[0]);
    truffleAssert.eventEmitted(result, 'CreateUser', ev => {
      return ev.ContractAddress;
    });
  });

  it('REVERT: Create duplicate user', async () => {
    await truffleAssert.reverts(
      instance.createUser(accounts[1], web3.utils.fromAscii('NA-SA'), 0),
      'User already created'
    );
  });

  it('Return user projects', async () => {
    const contractDetails = await userInstance.contractDetails();
    assert.include(contractDetails[0], web3.utils.fromAscii('NA-SA'));
  });

  after(async () => {
    await instance.kill({ from: accounts[0] });
  });
});
