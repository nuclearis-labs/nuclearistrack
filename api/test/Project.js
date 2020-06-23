const NuclearPoE = artifacts.require('../contracts/NuclearPoE.sol');
const Process = artifacts.require('../contracts/Process.sol');
const RoleBasedAcl = artifacts.require('../contracts/RoleBasedAcl.sol');
const { assert } = require('chai');
const truffleAssert = require('truffle-assertions');
const web3 = require('web3');

contract('Create Project', accounts => {
  let instance;
  let roleInstance;
  before(async () => {
    roleInstance = await RoleBasedAcl.new();
    instance = await NuclearPoE.new(roleInstance.address);
  });
  it('REVERT: Create a new project without correct role', async () => {
    await truffleAssert.reverts(
      instance.createProject(
        41955,
        accounts[1],
        web3.utils.asciiToHex('Conjunto Soporte'),
        web3.utils.asciiToHex('23423423 / 23423423'),
        { from: accounts[1] }
      ),
      'Sender does not have the correct role'
    );
  });
  it('EVENT: Create a new project', async () => {
    await roleInstance.assignRole(accounts[0], 'project:create', {
      from: accounts[0]
    });
    const result = await instance.createProject(
      41955,
      accounts[1],
      web3.utils.asciiToHex('Conjunto Soporte'),
      web3.utils.asciiToHex('23423423 / 23423423')
    );

    truffleAssert.eventEmitted(result, 'CreateProject');
  });

  it('REVERT: Create duplicate project', async () => {
    await truffleAssert.reverts(
      instance.createProject(
        41955,
        accounts[1],
        web3.utils.asciiToHex('Conjunto Soporte'),
        web3.utils.asciiToHex('23423423 / 23423423')
      ),
      'Project already created'
    );
  });
});

contract('Return Projects', accounts => {
  let instance;
  let roleInstance;
  before(async () => {
    roleInstance = await RoleBasedAcl.new();
    instance = await NuclearPoE.new(roleInstance.address);
    await roleInstance.assignRole(accounts[0], 'project:create', {
      from: accounts[0]
    });
    await instance.createProject(
      41955,
      accounts[1],
      web3.utils.asciiToHex('Conjunto Soporte'),
      web3.utils.asciiToHex('23423423 / 23423423')
    );
    await instance.createProject(
      41800,
      accounts[1],
      web3.utils.asciiToHex('Anillos 2019'),
      web3.utils.asciiToHex('23423423 / 23423423')
    );
  });
  it('REVERT: Return projects contracts without correct role', async () => {
    await truffleAssert.reverts(
      instance.getAllProjects(),
      'Sender does not have the correct role'
    );
  });
  it('Return projects contracts', async () => {
    await roleInstance.assignRole(accounts[0], 'projects:read', {
      from: accounts[0]
    });
    const result = await instance.getAllProjects();
    assert.lengthOf(result, 2, 'Result should be array of 2 projects');
  });
});

contract('Change Project Status', accounts => {
  let instance;
  let roleInstance;
  before(async () => {
    roleInstance = await RoleBasedAcl.new();
    instance = await NuclearPoE.new(roleInstance.address);
    await roleInstance.assignRole(accounts[0], 'project:create', {
      from: accounts[0]
    });
    await instance.createProject(
      41955,
      accounts[1],
      web3.utils.asciiToHex('Conjunto Soporte'),
      web3.utils.asciiToHex('23423423 / 23423423')
    );
    await instance.createProject(
      41956,
      accounts[1],
      web3.utils.asciiToHex('Conjunto Soporte'),
      web3.utils.asciiToHex('23423423 / 23423423')
    );
  });

  it('REVERT: Change Project Status without correct role', async () => {
    await truffleAssert.reverts(
      instance.changeProjectStatus(41955, {
        from: accounts[0]
      }),
      'Sender does not have the correct role'
    );
  });
  it('EVENT: Close Project', async () => {
    await roleInstance.assignRole(accounts[0], 'project:changeState', {
      from: accounts[0]
    });
    const result = await instance.changeProjectStatus(41955, {
      from: accounts[0]
    });
    truffleAssert.eventEmitted(result, 'ChangeProjectStatus');
  });
  it('REVERT: Close non existant Project', async () => {
    await truffleAssert.reverts(
      instance.changeProjectStatus(12333, {
        from: accounts[0]
      }),
      'Project does not exist or is already closed'
    );
  });
  it('REVERT: Close already closed Project', async () => {
    await instance.changeProjectStatus(41956, {
      from: accounts[0]
    });
    await truffleAssert.reverts(
      instance.changeProjectStatus(41956, {
        from: accounts[0]
      }),
      'Project does not exist or is already closed'
    );
  });
});
