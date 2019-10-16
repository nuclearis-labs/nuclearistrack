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
      instance.createUser(accounts[1], web3.utils.fromAscii('NA-SA'), {
        from: accounts[1]
      }),
      'Ownable: caller is not the owner.'
    );
  });

  it('Create user', async () => {
    const result = await instance.createUser(
      accounts[1],
      web3.utils.fromAscii('NA-SA')
    );
    truffleAssert.eventEmitted(result, 'CreateUser');
  });

  it('REVERT: Create duplicate user', async () => {
    await truffleAssert.reverts(
      instance.createUser(accounts[1], web3.utils.fromAscii('NA-SA')),
      'User already created'
    );
  });

  it('Return user projects', async () => {
    await truffleAssert.passes(instance.user(accounts[1]));
  });

  after(async () => {
    await instance.kill({ from: accounts[0] });
  });
});
