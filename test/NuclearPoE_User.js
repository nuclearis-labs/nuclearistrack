/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable node/no-unpublished-require */

const NuclearPoE = artifacts.require('../contracts/NuclearPoE.sol');
const truffleAssert = require('truffle-assertions');

const web3 = require('web3');

contract('User Contracts', accounts => {
  let instance;
  before(async () => {
    instance = await NuclearPoE.deployed();
  });

  it('REVERT: Create new user as non-owner', async () => {
    await truffleAssert.reverts(
      instance.createUser(accounts[1], 0, web3.utils.fromAscii('NA-SA'), {
        from: accounts[1]
      }),
      'Ownable: caller is not the owner.'
    );
  });

  it('Create user', async () => {
    const result = await instance.createUser(
      accounts[1],
      0,
      web3.utils.fromAscii('NA-SA')
    );
    truffleAssert.eventEmitted(result, 'CreateUser');
  });

  it('REVERT: Create duplicate user', async () => {
    await truffleAssert.reverts(
      instance.createUser(accounts[1], 0, web3.utils.fromAscii('NA-SA')),
      'User already created'
    );
  });

  it('Return user projects', async () => {
    await truffleAssert.passes(instance.user(accounts[1]));
  });

  it('EVENT: Change User Status', async () => {
    const result = await instance.changeUserStatus(accounts[1], {
      from: accounts[0]
    });
    truffleAssert.eventEmitted(result, 'ChangeUserStatus');
  });

  it('REVERT: Change User Status of non existant user', async () => {
    await truffleAssert.reverts(
      instance.changeUserStatus(accounts[7], {
        from: accounts[0]
      }),
      'User does not exist'
    );
  });

  it('REVERT: Change User Status as non owner', async () => {
    await truffleAssert.reverts(
      instance.changeUserStatus(accounts[2], {
        from: accounts[1]
      }),
      'Ownable: caller is not the owner.'
    );
  });
});
