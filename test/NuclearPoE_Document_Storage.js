const NuclearPoE = artifacts.require('./contracts/NuclearPoE.sol');
const Process = artifacts.require('../contracts/Process.sol');
const assert = require('chai').assert;
const truffleAssert = require('truffle-assertions');

contract('Document Storage', accounts => {
  let instance;
  let processAddress;
  let processInstance;
  before(async () => {
    instance = await NuclearPoE.deployed();
    await instance.createProject(
      41955,
      accounts[1],
      web3.utils.asciiToHex('Conjunto Soporte'),
      web3.utils.asciiToHex('234342 / 3453453')
    );
    const result = await instance.createProcess(
      accounts[2],
      web3.utils.asciiToHex('Mecanizado')
    );
    processAddress = result.logs[0].args[0];
    processInstance = await Process.at(processAddress);

    await processInstance.addDocument(
      'Documento',
      '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd',
      12,
      20,
      '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd',
      web3.utils.asciiToHex('-31,324234234'),
      web3.utils.asciiToHex('-54,324234234'),
      'Este es un comentario',
      { from: accounts[2] }
    );
  });
  it('Find a document storage', async () => {
    let result = await processInstance.getDocumentStorage(
      '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd'
    );
    assert.equal(
      result[0],
      '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd'
    );
  });
  it('REVERT: Find a non-existent document storage', async () => {
    await truffleAssert.reverts(
      processInstance.getDocumentStorage(
        '0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      ),
      'Document does not exist'
    );
  });
});
