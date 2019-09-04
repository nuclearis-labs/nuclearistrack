const NuclearPoE = artifacts.require('./contracts/NuclearPoE.sol');
const assert = require('chai').assert;
const truffleAssert = require('truffle-assertions');

contract('Create Project', accounts => {
  let instance;
  before(async () => {
    instance = await NuclearPoE.deployed();
  });
  it('EVENT: Create a new project', async () => {
    let result = await instance.createNewProject(
      41955,
      web3.utils.fromAscii('Conjunto Soporte'),
      accounts[1],
      web3.utils.fromAscii('NA-SA')
    );
    assert.nestedProperty(
      result,
      'receipt.transactionHash',
      'Result is missing a transactionHash property'
    );
    truffleAssert.eventEmitted(result, 'CreateNewProject', ev => {
      return (
        ev.expediente.toNumber() === 41955 &&
        ev.projectTitle ===
          '0x436f6e6a756e746f20536f706f72746500000000000000000000000000000000'
      );
    });
  });
  it('REVERT: Create duplicate project', async () => {
    await truffleAssert.reverts(
      instance.createNewProject(
        41955,
        web3.utils.fromAscii('Conjunto Soporte'),
        accounts[1],
        web3.utils.fromAscii('NA-SA')
      ),
      'Project already created'
    );
  });
  it('REVERT: Create new project as non-owner', async () => {
    await truffleAssert.reverts(
      instance.createNewProject(
        41950,
        web3.utils.fromAscii('Conjunto Soporte'),
        accounts[1],
        web3.utils.fromAscii('NA-SA'),
        { from: accounts[1] }
      ),
      'Only owner can make this change'
    );
  });
  after(async () => {
    await instance.kill({ from: accounts[0] });
  });
});

contract('Add Process', accounts => {
  let instance;
  before(async () => {
    instance = await NuclearPoE.deployed();
    await instance.createNewProject(
      41955,
      web3.utils.fromAscii('Conjunto Soporte'),
      accounts[1],
      web3.utils.fromAscii('NA-SA')
    );
  });
  it('EVENT: Add a process', async () => {
    let result = await instance.addProcessToProject(
      accounts[2],
      41955,
      web3.utils.fromAscii('Mecanizado'),
      web3.utils.fromAscii('BGH')
    );
    assert.nestedProperty(
      result,
      'receipt.transactionHash',
      'Result is missing a transactionHash property'
    );
    truffleAssert.eventEmitted(result, 'AddProcessToProject');
  });
  it('REVERT: Add duplicate process', async () => {
    await truffleAssert.reverts(
      instance.addProcessToProject(
        accounts[2],
        41955,
        web3.utils.fromAscii('Mecanizado'),
        web3.utils.fromAscii('BGH')
      ),
      'Process already created'
    );
  });

  it('REVERT: Add process to non-existent project', async () => {
    await truffleAssert.reverts(
      instance.addProcessToProject(
        accounts[2],
        41950,
        web3.utils.fromAscii('Mecanizado'),
        web3.utils.fromAscii('BGH')
      ),
      'Project does not exist'
    );
  });
  it('REVERT: Add process to already approved project', async () => {
    await instance.approveProject(41955, { from: accounts[1] });
    await truffleAssert.reverts(
      instance.addProcessToProject(
        accounts[3],
        41955,
        web3.utils.fromAscii('Plateado'),
        web3.utils.fromAscii('NRS')
      ),
      'Project is already approved by client'
    );
  });
  after(async () => {
    await instance.kill({ from: accounts[0] });
  });
});

contract('Approve Project', accounts => {
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
  it('EVENT: Approve a project', async () => {
    let result = await instance.approveProject(41955, { from: accounts[1] });
    assert.nestedProperty(
      result,
      'receipt.transactionHash',
      'Result is missing a transactionHash property'
    );
    truffleAssert.eventEmitted(result, 'ApproveProject');
  });
  it('REVERT: Approve project as non assigned client', async () => {
    await truffleAssert.reverts(
      instance.approveProject(41955, { from: accounts[2] }),
      'Only clients of this project can realize this operation'
    );
  });
  it('REVERT: Approve of already approved project', async () => {
    await truffleAssert.reverts(
      instance.approveProject(41955, { from: accounts[1] })
    );
  });

  it('REVERT: Approval of non-existent project', async () => {
    await truffleAssert.reverts(
      instance.approveProject(41950, { from: accounts[1] }),
      'Project does not exist'
    );
  });
  after(async () => {
    await instance.kill({ from: accounts[0] });
  });
});
