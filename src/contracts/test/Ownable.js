const NuclearPoE = artifacts.require('../NuclearPoE.sol');
const truffleAssert = require('truffle-assertions');

contract('Ownable', (accounts) => {
  it('renounce Ownership of contract', async () => {
    let instance = await NuclearPoE.new(accounts[0]);
    const result = await instance.renounceOwnership();
    truffleAssert.eventEmitted(result, 'OwnershipTransferred');
  });
  it('transfer Ownership of contract', async () => {
    let instance = await NuclearPoE.new(accounts[0]);
    const result = await instance.transferOwnership(accounts[1]);
    truffleAssert.eventEmitted(result, 'OwnershipTransferred');
  });
  it("new Owner can't be the zero address", async () => {
    let instance = await NuclearPoE.new(accounts[0]);
    await truffleAssert.reverts(
      instance.transferOwnership('0x0000000000000000000000000000000000000000'),
      'Ownable: new owner is the zero address'
    );
  });
});
