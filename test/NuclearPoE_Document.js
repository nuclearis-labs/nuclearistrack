const assert = require('chai').assert;
const NuclearPoE = artifacts.require('./contracts/NuclearPoE.sol');
const truffleAssert = require('truffle-assertions');

contract('Add Document', accounts => {
  let instance;
  before(async () => {
    instance = await NuclearPoE.deployed();
    await instance.createNewProject(
      41955,
      web3.utils.fromAscii('Conjunto Soporte'),
      accounts[1],
      web3.utils.fromAscii('NA-SA')
    );
    await instance.addProcessToProject(
      accounts[2],
      41955,
      web3.utils.fromAscii('Mecanizado'),
      web3.utils.fromAscii('BGH')
    );
  });
  it('REVERT: Add a document before approval of project', async () => {
    await truffleAssert.reverts(
      instance.addDocument(
        '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd',
        41955,
        Date.now(),
        web3.utils.fromAscii('Certificado'),
        '0x5086706447789201a455871d91ecb6b44562bd6213601efefcb4cf32af50d624',
        '12',
        '20',
        { from: accounts[2] }
      ),
      'Project is not approved by client'
    );
  });
  it('EVENT: Add a document', async () => {
    let time = Date.now();
    await instance.approveProject(41955, { from: accounts[1] });
    let result = await instance.addDocument(
      '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd',
      41955,
      time,
      web3.utils.fromAscii('Certificado'),
      '0x5086706447789201a455871d91ecb6b44562bd6213601efefcb4cf32af50d624',
      12,
      20,
      { from: accounts[2] }
    );
    assert.nestedProperty(
      result,
      'receipt.transactionHash',
      'Result is missing a transactionHash property'
    );
    truffleAssert.eventEmitted(result, 'AddDocument');
  });
  it('REVERT: Add a duplicate document (same hash)', async () => {
    await truffleAssert.reverts(
      instance.addDocument(
        '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd',
        41955,
        Date.now(),
        web3.utils.fromAscii('Certificado'),
        '0x5086706447789201a455871d91ecb6b44562bd6213601efefcb4cf32af50d624',
        '12',
        '20',
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
  before(async () => {
    instance = await NuclearPoE.deployed();
    await instance.createNewProject(
      41955,
      web3.utils.fromAscii('Conjunto Soporte'),
      accounts[1],
      web3.utils.fromAscii('NA-SA')
    );
    await instance.addProcessToProject(
      accounts[2],
      41955,
      web3.utils.fromAscii('Mecanizado'),
      web3.utils.fromAscii('BGH')
    );
    await instance.approveProject(41955, { from: accounts[1] });
    await instance.addDocument(
      '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd',
      41955,
      Date.now(),
      web3.utils.fromAscii('Certificado'),
      '0x5086706447789201a455871d91ecb6b44562bd6213601efefcb4cf32af50d624',
      '12',
      '20',
      { from: accounts[2] }
    );
  });
  it('Find a document', async () => {
    let result = await instance.findDocument(
      '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd',
      41955,
      accounts[2]
    );
    assert.equal(
      result[0],
      accounts[2],
      'Document record does not match requested document'
    );
  });
  it('REVERT: Find a non-existent document', async () => {
    await truffleAssert.reverts(
      instance.findDocument(
        '0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        41955,
        accounts[2]
      )
    );
  });
  after(async () => {
    await instance.kill({ from: accounts[0] });
  });
});
