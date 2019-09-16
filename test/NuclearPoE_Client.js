const NuclearPoE = artifacts.require('../contracts/NuclearPoE.sol');
const Client = artifacts.require('../contracts/Client.sol');
const assert = require('chai').assert;
let clientInstance;
let result;

contract('Client Contracts', accounts => {
  let instance;
  before(async () => {
    instance = await NuclearPoE.deployed();
    result = await instance.createProject(
      41955,
      web3.utils.fromAscii('Conjunto Soporte'),
      accounts[1],
      web3.utils.fromAscii('NA-SA')
    );
    clientInstance = await Client.at(result.logs[0].args[1]);
  });
  it('Return client projects', async () => {
    let contractDetails = await clientInstance.contractDetails();
    assert.equal(contractDetails[1], result.logs[0].args[0]);
  });

  after(async () => {
    await clientInstance.kill({ from: accounts[0] });
  });
});
