const truffleAssert = require('truffle-assertions');
const NuclearPoE = artifacts.require('../NuclearPoE.sol');

contract('User', (accounts) => {
  let instance;
  before(async () => {
    instance = await NuclearPoE.new(accounts[0]);
  });
  it('Create a new user', async () => {
    const result = await instance.createUser('1', accounts[1], 'NA-SA');

    truffleAssert.eventEmitted(result, 'CreateUser');
  });
  it('Return a user', async () => {
    const result = await instance.getUser(accounts[1]);
    assert.deepEqual(result, {
      '0': web3.utils.toBN('1'),
      '1': web3.utils.toBN('1'),
      '2': 'NA-SA',
      '3': accounts[1],
    });
  });
  it('Return a user as non-user', async () => {
    await truffleAssert.reverts(
      instance.getUser(accounts[1], { from: accounts[2] }),
      'Sender is not whitelisted'
    );
  });
  it('Return all users', async () => {
    const result = await instance.getAllUsers();
    assert.deepEqual(result, [accounts[0], accounts[1]]);
  });
  it('Toggle a non-existant user status', async () => {
    await truffleAssert.reverts(
      instance.toggleUserStatus(accounts[3]),
      'User does not exist'
    );
  });
  it('Toggle a user status from created to closed', async () => {
    const result = await instance.toggleUserStatus(accounts[1]);
    truffleAssert.eventEmitted(result, 'ToggleUserStatus');
  });
  it('Toggle a user status from closed to created', async () => {
    const result = await instance.toggleUserStatus(accounts[1]);
    truffleAssert.eventEmitted(result, 'ToggleUserStatus');
  });
});
