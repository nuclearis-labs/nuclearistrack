/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable node/no-unpublished-require */

const { assert } = require('chai');
const truffleAssert = require('truffle-assertions');
const web3 = require('web3');

const NuclearPoE = artifacts.require('../contracts/NuclearPoE.sol');
const Process = artifacts.require('../contracts/Process.sol');

contract('Add Document', accounts => {
  let instance;
  let processAddress;
  let processInstance;
  before(async () => {
    instance = await NuclearPoE.deployed();
    await instance.createUser(accounts[1], 0, web3.utils.asciiToHex('NA-SA'));

    await instance.createProject(
      41955,
      accounts[1],
      web3.utils.asciiToHex('Conjunto Soporte'),
      web3.utils.asciiToHex('234342 / 3453453')
    );
    await instance.createUser(accounts[2], 1, web3.utils.asciiToHex('IMECO'));

    const result = await instance.createProcess(
      accounts[2],
      web3.utils.asciiToHex('Mecanizado')
    );

    processAddress = result.logs[0].args[0];
    processInstance = await Process.at(processAddress);
  });
  it('EVENT: Add a document', async () => {
    const result = await processInstance.addDocument(
      '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd',
      12,
      20,
      '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd',
      web3.utils.asciiToHex('-31,324234234'),
      web3.utils.asciiToHex('-54,324234234'),
      { from: accounts[2] }
    );

    truffleAssert.eventEmitted(result, 'AddDocument');
  });
  it('EVENT: Add a document as non-supplier', async () => {
    await truffleAssert.reverts(
      processInstance.addDocument(
        '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd',
        12,
        20,
        '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd',
        web3.utils.asciiToHex('-31,324234234'),
        web3.utils.asciiToHex('-54,324234234'),
        { from: accounts[0] }
      ),
      'Has to be supplier of project'
    );
  });
  it('REVERT: Add a duplicate document (same hash)', async () => {
    await truffleAssert.reverts(
      processInstance.addDocument(
        '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd',
        12,
        20,
        '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd',
        web3.utils.asciiToHex('-31,324234234'),
        web3.utils.asciiToHex('-54,324234234'),
        { from: accounts[2] }
      ),
      'Document already created'
    );
  });

  after(async () => {
    await instance.kill({ from: accounts[0] });
  });
});

contract('Find Document', accounts => {
  let instance;
  let processAddress;
  let processInstance;
  before(async () => {
    instance = await NuclearPoE.deployed();
    await instance.createUser(accounts[1], 0, web3.utils.asciiToHex('NA-SA'));

    await instance.createProject(
      41955,
      accounts[1],
      web3.utils.asciiToHex('Conjunto Soporte'),
      web3.utils.asciiToHex('234342 / 3453453')
    );
    await instance.createUser(accounts[2], 1, web3.utils.asciiToHex('IMECO'));

    const result = await instance.createProcess(
      accounts[2],
      web3.utils.asciiToHex('Mecanizado')
    );
    processAddress = result.logs[0].args[0];
    processInstance = await Process.at(processAddress);

    await processInstance.addDocument(
      '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd',
      12,
      20,
      '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd',
      web3.utils.asciiToHex('-31,324234234'),
      web3.utils.asciiToHex('-54,324234234'),
      { from: accounts[2] }
    );
  });
  it('Find a document', async () => {
    const result = await processInstance.findDocument(
      '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd'
    );
    assert.equal(
      result[2],
      '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd',
      'Document record does not match requested document'
    );
  });
  it('REVERT: Find a non-existent document', async () => {
    await truffleAssert.reverts(
      processInstance.findDocument(
        '0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      )
    );
  });
  after(async () => {
    await instance.kill({ from: accounts[0] });
  });
});

/*
contract('Return Documents', accounts => {
  let instance;
  before(async () => {
    instance = await NuclearPoE.deployed();
    const result = await instance.createProject(
      41955,
      web3.utils.asciiToHex('Conjunto Soporte'),
      accounts[1],
      web3.utils.asciiToHex('NA-SA')
    );
    instance = await Project.at(result.logs[0].args[0]);

    await instance.addProcess(
      accounts[2],
      web3.utils.asciiToHex('Mecanizado'),
      web3.utils.asciiToHex('BGH')
    );
    await instance.approveProject({ from: accounts[1] });
    await instance.addDocument(
      accounts[2],
      '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd',
      web3.utils.asciiToHex('Certificado'),
      { from: accounts[2] }
    );
    await instance.addDocument(
      accounts[2],
      '0xa31fe9656fc8d3a459e623dc8204e6d0268f8df56d734dac3ca3262edb5db883',
      web3.utils.asciiToHex('Certificado'),
      { from: accounts[2] }
    );
  });
  it('Return 2 document hashes', async () => {
    const result = await instance.returnDocument();
    assert.lengthOf(result, 2, 'Result should be array of 2 document hashes');
  });
  after(async () => {
    await instance.kill({ from: accounts[0] });
  });
});
*/
