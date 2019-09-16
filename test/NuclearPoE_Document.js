const assert = require('chai').assert;
const NuclearPoE = artifacts.require('../contracts/NuclearPoE.sol');
const Project = artifacts.require('../contracts/Project.sol');
const truffleAssert = require('truffle-assertions');

contract('Add Document', accounts => {
  let instance;
  before(async () => {
    instance = await NuclearPoE.deployed();
    let result = await instance.createProject(
      41955,
      web3.utils.fromAscii('Conjunto Soporte'),
      accounts[1],
      web3.utils.fromAscii('NA-SA')
    );
    instance = await Project.at(result.logs[0].args[0]);

    await instance.addProcess(
      accounts[2],
      web3.utils.fromAscii('Mecanizado'),
      web3.utils.fromAscii('BGH')
    );
  });
  it('REVERT: Add a document before approval of project', async () => {
    await truffleAssert.reverts(
      instance.addDocument(
        accounts[2],
        '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd',
        web3.utils.fromAscii('Certificado'),
        { from: accounts[2] }
      ),
      'Project is not approved by client'
    );
  });
  it('EVENT: Add a document', async () => {
    await instance.approveProject({ from: accounts[1] });
    let result = await instance.addDocument(
      accounts[2],
      '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd',
      web3.utils.fromAscii('Certificado'),
      { from: accounts[2] }
    );
    assert.nestedPropertyVal(
      result,
      'receipt.status',
      true,
      'Result is missing a transactionHash property'
    );
    truffleAssert.eventEmitted(result, 'AddDocument');
  });
  it('REVERT: Add a duplicate document (same hash)', async () => {
    await truffleAssert.reverts(
      instance.addDocument(
        accounts[2],
        '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd',
        web3.utils.fromAscii('Certificado'),
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
    let result = await instance.createProject(
      41955,
      web3.utils.fromAscii('Conjunto Soporte'),
      accounts[1],
      web3.utils.fromAscii('NA-SA')
    );
    instance = await Project.at(result.logs[0].args[0]);

    await instance.addProcess(
      accounts[2],
      web3.utils.fromAscii('Mecanizado'),
      web3.utils.fromAscii('BGH')
    );
    await instance.approveProject({ from: accounts[1] });
    await instance.addDocument(
      accounts[2],
      '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd',
      web3.utils.fromAscii('Certificado'),
      { from: accounts[2] }
    );
  });
  it('Find a document', async () => {
    let result = await instance.findDocument(
      accounts[2],
      '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd'
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
        accounts[2],
        '0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      )
    );
  });
  after(async () => {
    await instance.kill({ from: accounts[0] });
  });
});

contract('Return Documents', accounts => {
  let instance;
  before(async () => {
    instance = await NuclearPoE.deployed();
    let result = await instance.createProject(
      41955,
      web3.utils.fromAscii('Conjunto Soporte'),
      accounts[1],
      web3.utils.fromAscii('NA-SA')
    );
    instance = await Project.at(result.logs[0].args[0]);

    await instance.addProcess(
      accounts[2],
      web3.utils.fromAscii('Mecanizado'),
      web3.utils.fromAscii('BGH')
    );
    await instance.approveProject({ from: accounts[1] });
    await instance.addDocument(
      accounts[2],
      '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd',
      web3.utils.fromAscii('Certificado'),
      { from: accounts[2] }
    );
    await instance.addDocument(
      accounts[2],
      '0xa31fe9656fc8d3a459e623dc8204e6d0268f8df56d734dac3ca3262edb5db883',
      web3.utils.fromAscii('Certificado'),
      { from: accounts[2] }
    );
  });
  it('Return 2 document hashes', async () => {
    let result = await instance.returnDocument();
    assert.lengthOf(result, 2, 'Result should be array of 2 document hashes');
  });
  after(async () => {
    await instance.kill({ from: accounts[0] });
  });
});
