/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable node/no-unpublished-require */

const NuclearPoE = artifacts.require('../contracts/NuclearPoE.sol');
const Client = artifacts.require('../contracts/Client.sol');
const { assert } = require('chai');
const truffleAssert = require('truffle-assertions');

const web3 = require('web3');

contract('Client Contracts', accounts => {
  let instance;
  let clientInstance;
  before(async () => {
    instance = await NuclearPoE.deployed();
  });

  it('Create client', async () => {
    const result = await instance.createClient(
      accounts[1],
      web3.utils.fromAscii('NA-SA')
    );
    clientInstance = await Client.at(result.logs[0].args[0]);
    truffleAssert.eventEmitted(result, 'CreateClient', ev => {
      return ev.ContractAddress;
    });
  });

  it('Return client projects', async () => {
    const contractDetails = await clientInstance.contractDetails();
    assert.include(contractDetails[0], web3.utils.fromAscii('NA-SA'));
  });

  after(async () => {
    await instance.kill({ from: accounts[0] });
  });
});
