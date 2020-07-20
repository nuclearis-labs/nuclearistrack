const NuclearPoE = artifacts.require('../NuclearPoE.sol');
const truffleAssert = require('truffle-assertions');

contract('Create Project', (accounts) => {
  let instance;
  before(async () => {
    instance = await NuclearPoE.new(accounts[0]);
  });
  it('REVERT: Create project as non-owner', async () => {
    await truffleAssert.reverts(
      instance.createProject(
        41955,
        accounts[1],
        'Conjunto Soporte',
        '23423423 / 23423423',
        { from: accounts[1] }
      ),
      'Ownable: caller is not the owner'
    );
  });
  it('EVENT: Create a new project', async () => {
    const result = await instance.createProject(
      41955,
      accounts[1],
      'Conjunto Soporte',
      '23423423 / 23423423'
    );

    truffleAssert.eventEmitted(result, 'CreateProject');
  });

  it('REVERT: Create duplicate project', async () => {
    await truffleAssert.reverts(
      instance.createProject(
        41955,
        accounts[1],
        'Conjunto Soporte',
        '23423423 / 23423423'
      ),
      'Project already created or closed'
    );
  });
});

contract('Return Projects', (accounts) => {
  let instance;
  before(async () => {
    instance = await NuclearPoE.new(accounts[0]);
    await instance.createProject(
      41955,
      accounts[1],
      'Conjunto Soporte',
      '23423423 / 23423423'
    );
    await instance.createProject(
      41800,
      accounts[1],
      'Anillos 2019',
      '23423423 / 23423423'
    );
    await instance.createProject(
      51233,
      accounts[2],
      'Anillos 2019',
      '23423423 / 23423423'
    );
  });
  it('Return projects contracts as owner', async () => {
    const result = await instance.getProjectsByAddress();
    assert.lengthOf(result, 3, 'Result should be array of 3 projects');
  });
  it('Return projects contracts as client', async () => {
    const result = await instance.getProjectsByAddress({ from: accounts[1] });
    assert.lengthOf(result, 2, 'Result should be array of 2 projects');
  });
  it('Return empty array if called by address without corresponding projects', async () => {
    const result = await instance.getProjectsByAddress({ from: accounts[3] });
    assert.lengthOf(result, 0, 'Result should be an empty array');
  });
  it('REVERT: Get project details as non-owner or non-assigned client', async () => {
    await truffleAssert.reverts(
      instance.getProjectDetails(41955, { from: accounts[3] }),
      'User has to be assigned client or owner'
    );
  });
  it('Return details of project as client', async () => {
    const result = await instance.getProjectDetails(41955, {
      from: accounts[1],
    });
    const expectedTitle = 'Conjunto Soporte';

    const expectedPurchaseOrder = '23423423 / 23423423';

    assert.deepEqual(result, {
      '0': web3.utils.toBN(1),
      '1': web3.utils.toBN(41955),
      '2': accounts[1],
      '3': expectedTitle,
      '4': expectedPurchaseOrder,
      '5': [],
    });
  });
  it('Return details of project as owner', async () => {
    const result = await instance.getProjectDetails(41800, {
      from: accounts[0],
    });
    const expectedTitle = 'Anillos 2019';

    const expectedPurchaseOrder = '23423423 / 23423423';

    assert.deepEqual(result, {
      '0': web3.utils.toBN(1),
      '1': web3.utils.toBN(41800),
      '2': accounts[1],
      '3': expectedTitle,
      '4': expectedPurchaseOrder,
      '5': [],
    });
  });
});

contract('Toggle Project Status', (accounts) => {
  let instance;
  before(async () => {
    instance = await NuclearPoE.new(accounts[0]);
    await instance.createProject(
      41955,
      accounts[1],
      'Conjunto Soporte',
      '23423423 / 23423423'
    );
    await instance.createProject(
      41956,
      accounts[1],
      'Conjunto Soporte',
      '23423423 / 23423423'
    );
  });
  it('REVERT: Toggle project as non-owner', async () => {
    await truffleAssert.reverts(
      instance.toggleProjectStatus(41955, { from: accounts[1] }),
      'Ownable: caller is not the owner'
    );
  });
  it('EVENT: Close Project', async () => {
    const result = await instance.toggleProjectStatus(41955, {
      from: accounts[0],
    });
    truffleAssert.eventEmitted(result, 'ToggleProjectStatus');
  });
  it('REVERT: Close non existant Project', async () => {
    await truffleAssert.reverts(
      instance.toggleProjectStatus(12333, {
        from: accounts[0],
      }),
      'Project does not exist'
    );
  });
  it('EVENT: Reopen closed Project', async () => {
    const result = await instance.toggleProjectStatus(41956, {
      from: accounts[0],
    });
    truffleAssert.eventEmitted(result, 'ToggleProjectStatus');
  });
});
