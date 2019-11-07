/* eslint-disable no-await-in-loop */
/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable node/no-unpublished-require */

const NuclearPoE = artifacts.require('../contracts/NuclearPoE.sol');
const Process = artifacts.require('../contracts/Process.sol');
const { assert } = require('chai');
const truffleAssert = require('truffle-assertions');
const web3 = require('web3');

contract('Process', accounts => {
  let instance;
  let processAddress;
  let processInstance;
  before(async () => {
    instance = await NuclearPoE.deployed();
    await instance.createUser(accounts[1], 0, web3.utils.asciiToHex('NA-SA'));
    await instance.createUser(accounts[2], 1, web3.utils.asciiToHex('IMECO'));

    await instance.createProject(
      41955,
      accounts[1],
      web3.utils.asciiToHex('Conjunto Soporte'),
      web3.utils.asciiToHex('23423423 / 23423423')
    );
  });

  it('REVERT: Create new process as non-owner', async () => {
    await truffleAssert.reverts(
      instance.createProcess(accounts[2], web3.utils.asciiToHex('Mecanizado'), {
        from: accounts[1]
      }),
      'Ownable: caller is not the owner.'
    );
  });

  it('EVENT: Add a process', async () => {
    const result = await instance.createProcess(
      accounts[2],
      web3.utils.asciiToHex('Mecanizado')
    );

    processAddress = result.logs[0].args[0];
    processInstance = await Process.at(processAddress);

    truffleAssert.eventEmitted(result, 'CreateProcess');
  });

  it('REVERT: Add a process with non-existing User', async () => {
    truffleAssert.reverts(
      instance.createProcess(accounts[3], web3.utils.asciiToHex('Mecanizado')),
      'User does not exist'
    );
  });

  it('Get Process Details', async () => {
    const result = await processInstance.getDetails();
    assert(result[0], instance.address);
    assert(result[1], accounts[0]);
    assert(result[2], accounts[2]);
    assert(result[3], web3.utils.asciiToHex('Mecanizado'));
    assert(result[4], []);
    assert(result[5], processAddress);
  });

  it('Get All Documents', async () => {
    const result = await processInstance.getAllDocuments();
    assert(result, []);
  });
});
