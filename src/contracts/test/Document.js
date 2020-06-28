const truffleAssert = require('truffle-assertions');
const NuclearPoE = artifacts.require('../NuclearPoE.sol');
const Process = artifacts.require('../Process.sol');

contract('Add Document', (accounts) => {
  let instance;
  let processAddress;
  let processInstance;
  before(async () => {
    instance = await NuclearPoE.new();
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
  });
  it('EVENT: Add a document', async () => {
    const result = await processInstance.addDocument(
      'Documento',
      '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd',
      web3.utils.asciiToHex('-31,324234234'),
      web3.utils.asciiToHex('-54,324234234'),
      'Este es un comentario',
      { from: accounts[2] }
    );

    truffleAssert.eventEmitted(result, 'AddDocument');
  });
  it('REVERT: Add a document as non-supplier', async () => {
    await truffleAssert.reverts(
      processInstance.addDocument(
        'Documento',
        '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd',
        web3.utils.asciiToHex('-31,324234234'),
        web3.utils.asciiToHex('-54,324234234'),
        'Este es un comentario',
        { from: accounts[0] }
      ),
      'Sender is not supplier of project'
    );
  });
  it('REVERT: Add a duplicate document (same hash)', async () => {
    await truffleAssert.reverts(
      processInstance.addDocument(
        'Documento',
        '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd',
        web3.utils.asciiToHex('-31,324234234'),
        web3.utils.asciiToHex('-54,324234234'),
        'Este es un comentario',
        { from: accounts[2] }
      ),
      'Document already created'
    );
  });
});

contract('Find Document', (accounts) => {
  let instance;
  let processAddress;
  let processInstance;

  before(async () => {
    instance = await NuclearPoE.new();
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
      web3.utils.asciiToHex('-31,324234234'),
      web3.utils.asciiToHex('-54,324234234'),
      'Este es un comentario',
      { from: accounts[2] }
    );
  });
  it('Find a document', async () => {
    const result = await processInstance.getDocument(
      '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd'
    );
    assert.equal(result[0], 'Documento');
  });
  it('REVERT: Find a non-existent document', async () => {
    await truffleAssert.reverts(
      processInstance.getDocument(
        '0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      ),
      'Document does not exist'
    );
  });
});

contract('Return Documents', (accounts) => {
  let processInstance;
  let processAddress;
  let instance;
  before(async () => {
    instance = await NuclearPoE.new();
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
      web3.utils.asciiToHex('-31,324234234'),
      web3.utils.asciiToHex('-54,324234234'),
      'Este es un comentario',
      { from: accounts[2] }
    );
    await processInstance.addDocument(
      'Documento',
      '0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      web3.utils.asciiToHex('-31,324234234'),
      web3.utils.asciiToHex('-54,324234234'),
      'Este es un comentario',
      { from: accounts[2] }
    );
  });
  it('Return 2 document hashes', async () => {
    const result = await processInstance.getDetails({ from: accounts[0] });
    assert.lengthOf(
      result[2],
      2,
      'Result should be array of 2 document hashes'
    );
  });
});
