/* eslint-disable no-await-in-loop */
/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable node/no-unpublished-require */

const NuclearPoE = artifacts.require('../contracts/NuclearPoE.sol');
const Project = artifacts.require('../contracts/Project.sol');
const User = artifacts.require('../contracts/User.sol');
const { assert } = require('chai');
const truffleAssert = require('truffle-assertions');
const web3 = require('web3');

contract('Create Project', accounts => {
  let instance;
  before(async () => {
    instance = await NuclearPoE.deployed();
  });
  it('EVENT: Create a new project', async () => {
    await instance.createUser(accounts[1], web3.utils.fromAscii('NA-SA'));
    const result = await instance.createProject(
      41955,
      web3.utils.fromAscii('Conjunto Soporte'),
      accounts[1]
    );

    truffleAssert.eventEmitted(result, 'CreateProject', ev => {
      return ev.newProjectContractAddress;
    });
  });

  it('REVERT: Create duplicate project', async () => {
    await truffleAssert.reverts(
      instance.createProject(
        41955,
        web3.utils.fromAscii('Conjunto Soporte'),
        accounts[1]
      ),
      'Project already created'
    );
  });
  it('REVERT: Create project with non-existing User', async () => {
    await truffleAssert.reverts(
      instance.createProject(
        56543,
        web3.utils.fromAscii('Conjunto Soporte'),
        accounts[3]
      ),
      'User does not exist'
    );
  });
  it('REVERT: Create new project as non-owner', async () => {
    await truffleAssert.reverts(
      instance.createProject(
        41950,
        web3.utils.fromAscii('Conjunto Soporte'),
        accounts[1],
        { from: accounts[1] }
      ),
      'Ownable: caller is not the owner.'
    );
  });
  after(async () => {
    await instance.kill({ from: accounts[0] });
  });
});

contract('Add Process', accounts => {
  let instance;
  let projectAddress;
  before(async () => {
    instance = await NuclearPoE.deployed();
    await instance.createUser(accounts[1], web3.utils.fromAscii('NA-SA'));
    user = await instance.createUser(
      accounts[2],
      web3.utils.fromAscii('IMECO')
    );

    const result = await instance.createProject(
      41955,
      web3.utils.fromAscii('Conjunto Soporte'),
      accounts[1]
    );

    projectAddress = result.logs[0].args[0];
    projectInstance = await Project.at(projectAddress);
  });

  it('REVERT: Create new process as non-owner', async () => {
    await truffleAssert.reverts(
      projectInstance.addProcess(
        accounts[2],
        web3.utils.fromAscii('Mecanizado'),
        {
          from: accounts[1]
        }
      ),
      'Has to be Material Organization.'
    );
  });

  it('EVENT: Add a process', async () => {
    const result = await projectInstance.addProcess(
      accounts[2],
      web3.utils.fromAscii('Mecanizado')
    );

    truffleAssert.eventEmitted(result, 'AddProcess');
  });

  it('REVERT: Add duplicate process', async () => {
    await truffleAssert.reverts(
      projectInstance.addProcess(
        accounts[2],
        web3.utils.fromAscii('Mecanizado')
      ),
      'Process already created'
    );
  });

  it('REVERT: Add a process with non-existing User', async () => {
    truffleAssert.reverts(
      projectInstance.addProcess(
        accounts[3],
        web3.utils.fromAscii('Mecanizado')
      ),
      'User does not exist'
    );
  });

  it('REVERT: Add process to already approved project', async () => {
    await instance.createUser(accounts[3], web3.utils.fromAscii('BGH'));
    await projectInstance.approveProject({ from: accounts[1] });
    await truffleAssert.reverts(
      projectInstance.addProcess(accounts[3], web3.utils.fromAscii('Plateado')),
      'Project is already approved by client'
    );
  });
  after(async () => {
    await instance.kill({ from: accounts[0] });
    await projectInstance.kill({ from: accounts[0] });
  });
});

contract('Approve Project', accounts => {
  let instance;
  before(async () => {
    instance = await NuclearPoE.deployed();
    await instance.createUser(accounts[1], web3.utils.fromAscii('NA-SA'));
    await instance.createUser(accounts[2], web3.utils.fromAscii('IMECO'));
    const result = await instance.createProject(
      41955,
      web3.utils.fromAscii('Conjunto Soporte'),
      accounts[1]
    );
    projectInstance = await Project.at(result.logs[0].args[0]);
  });
  it('EVENT: Approve a project', async () => {
    const result = await projectInstance.approveProject({ from: accounts[1] });
    truffleAssert.eventEmitted(result, 'ApproveProject');
  });

  it('REVERT: Approve project as owner', async () => {
    await truffleAssert.reverts(
      projectInstance.approveProject({ from: accounts[0] }),
      'Only clients of this project can realize this operation'
    );
  });

  it('REVERT: Approve project as non assigned User', async () => {
    await truffleAssert.reverts(
      projectInstance.approveProject({ from: accounts[2] }),
      'Only clients of this project can realize this operation'
    );
  });
  it('REVERT: Approve of already approved project', async () => {
    await truffleAssert.reverts(
      projectInstance.approveProject({ from: accounts[1] }),
      'Project already approved'
    );
  });
  after(async () => {
    await instance.kill({ from: accounts[0] });
    await projectInstance.kill({ from: accounts[0] });
  });
});

contract('Return Projects', accounts => {
  let instance;
  before(async () => {
    instance = await NuclearPoE.deployed();
    await instance.createUser(accounts[1], web3.utils.fromAscii('NA-SA'));
    await instance.createUser(accounts[2], web3.utils.fromAscii('IMECO'));
    await instance.createProject(
      41955,
      web3.utils.fromAscii('Conjunto Soporte'),
      accounts[1]
    );
    await instance.createProject(
      41800,
      web3.utils.fromAscii('Anillos 2020'),
      accounts[1]
    );
  });
  it('Return projects contracts', async () => {
    const result = await instance.getAllProjectContract();
    assert.lengthOf(result, 2, 'Result should be array of 2 projects');
  });
  after(async () => {
    await instance.kill({ from: accounts[0] });
  });
});
