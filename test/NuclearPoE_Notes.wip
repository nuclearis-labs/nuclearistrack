/* const NuclearPoE = artifacts.require('./contracts/NuclearPoE.sol');
const assert = require('chai').assert;
const truffleAssert = require('truffle-assertions');

contract('Add Note', accounts => {
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
  it('EVENT: Add a new note', async () => {
    let result = await instance.addNote(
      1,
      '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd',
      41955,
      accounts[2],
      'Problema con materia prima'
    );
    assert.nestedProperty(
      result,
      'receipt.transactionHash',
      'Result is missing a transactionHash property'
    );
    truffleAssert.eventEmitted(result, 'AddNote', ev => {
      return (
        ev.hash ===
          '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd' &&
        ev.expediente.toNumber() === 41955
      );
    });
  });
  it('REVERT: Add duplicate note', async () => {
    await truffleAssert.reverts(
      instance.addNote(
        1,
        '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd',
        41955,
        accounts[2],
        'Problema con materia prima'
      ),
      'Note does already exist'
    );
  });
  it('REVERT: Add note to non-existent document', async () => {
    await truffleAssert.reverts(
      instance.addNote(
        2,
        '0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        41955,
        accounts[2],
        'Problema con materia prima'
      ),
      'Document does not exist'
    );
  });
  after(async () => {
    await instance.kill({ from: accounts[0] });
  });
});

contract('Return Note', accounts => {
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
    await instance.addNote(
      1,
      '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd',
      41955,
      accounts[2],
      'Problema con materia prima'
    );
  });
  it('Return a note', async () => {
    let result = await instance.returnNote(
      '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd',
      41955,
      accounts[2],
      1
    );
    assert.equal(
      result[0],
      accounts[0],
      'Note record does not match requested note'
    );
  });
  it('REVERT: Return note from a non-existent document', async () => {
    await truffleAssert.reverts(
      instance.returnNote(
        '0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        41955,
        accounts[2],
        1
      ),
      'Document does not exist'
    );
  });
  it('REVERT: Return non-existent note from a document', async () => {
    await truffleAssert.reverts(
      instance.returnNote(
        '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd',
        41955,
        accounts[2],
        5
      ),
      'Note does not exist'
    );
  });
  after(async () => {
    await instance.kill({ from: accounts[0] });
  });
});
 */
