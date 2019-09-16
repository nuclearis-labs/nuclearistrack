const NuclearPoE = artifacts.require('../contracts/NuclearPoE.sol');
const Project = artifacts.require('../contracts/Project.sol');
const assert = require('chai').assert;
const truffleAssert = require('truffle-assertions');
let newProjectContract;

contract('Create Project', accounts => {
  let instance;
  before(async () => {
    instance = await NuclearPoE.deployed();
  });
  it('EVENT: Create a new project', async () => {
    let result = await instance.createProject(
      41955,
      web3.utils.fromAscii('Conjunto Soporte'),
      accounts[1],
      web3.utils.fromAscii('NA-SA')
    );

    assert.nestedPropertyVal(
      result,
      'receipt.status',
      true,
      'Result is missing a transactionHash property'
    );
    truffleAssert.eventEmitted(result, 'CreateNewProject', ev => {
      return (
        ev.newProjectContractAddress &&
        ev.expediente.toNumber() === 41955 &&
        ev.projectTitle ===
          '0x436f6e6a756e746f20536f706f72746500000000000000000000000000000000'
      );
    });
  });
  it('REVERT: Create duplicate project', async () => {
    await truffleAssert.reverts(
      instance.createProject(
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
      instance.createProject(
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
    let result = await instance.createProject(
      41955,
      web3.utils.fromAscii('Conjunto Soporte'),
      accounts[1],
      web3.utils.fromAscii('NA-SA')
    );
    instance = await Project.at(result.logs[0].args[0]);
  });

  it('EVENT: Add a process', async () => {
    let result = await instance.addProcess(
      accounts[2],
      web3.utils.fromAscii('Mecanizado'),
      web3.utils.fromAscii('BGH')
    );
    assert.nestedPropertyVal(
      result,
      'receipt.status',
      true,
      'Result is missing a transactionHash property'
    );
    truffleAssert.eventEmitted(result, 'AddProcess');
  });

  it('REVERT: Add duplicate process', async () => {
    await truffleAssert.reverts(
      instance.addProcess(
        accounts[2],
        web3.utils.fromAscii('Mecanizado'),
        web3.utils.fromAscii('BGH')
      ),
      'Process already created'
    );
  });
  it('REVERT: Add process to already approved project', async () => {
    await instance.approveProject({ from: accounts[1] });
    await truffleAssert.reverts(
      instance.addProcess(
        accounts[3],
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
    let result = await instance.createProject(
      41955,
      web3.utils.fromAscii('Conjunto Soporte'),
      accounts[1],
      web3.utils.fromAscii('NA-SA')
    );
    instance = await Project.at(result.logs[0].args[0]);
  });
  it('EVENT: Approve a project', async () => {
    let result = await instance.approveProject({ from: accounts[1] });
    assert.nestedPropertyVal(
      result,
      'receipt.status',
      true,
      'Result is missing a transactionHash property'
    );
    truffleAssert.eventEmitted(result, 'ApproveProject');
  });

  it('REVERT: Approve project as non assigned client', async () => {
    await truffleAssert.reverts(
      instance.approveProject({ from: accounts[2] }),
      'Only clients of this project can realize this operation'
    );
  });
  it('REVERT: Approve of already approved project', async () => {
    await truffleAssert.reverts(
      instance.approveProject({ from: accounts[1] }),
      'Project already approved'
    );
  });
  after(async () => {
    await instance.kill({ from: accounts[0] });
  });
});
