const NuclearPoE = artifacts.require('../NuclearPoE.sol');
const truffleAssert = require('truffle-assertions');

contract('Create Project', (accounts) => {
  let instance;
  before(async () => {
    instance = await NuclearPoE.new();
  });
  it('EVENT: Create a new project', async () => {
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

contract('Return Projects', (accounts) => {
  let instance;
  before(async () => {
    instance = await NuclearPoE.new();
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
  it('Return projects contracts', async () => {
    const result = await instance.getAllProjects();
    assert.lengthOf(result, 2, 'Result should be array of 2 projects');
  });
});

contract('Change Project Status', (accounts) => {
  let instance;
  before(async () => {
    instance = await NuclearPoE.new();
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

  it('EVENT: Close Project', async () => {
    const result = await instance.changeProjectStatus(41955, {
      from: accounts[0],
    });
    truffleAssert.eventEmitted(result, 'ChangeProjectStatus');
  });
  it('REVERT: Close non existant Project', async () => {
    await truffleAssert.reverts(
      instance.changeProjectStatus(12333, {
        from: accounts[0],
      }),
      'Project does not exist or is already closed'
    );
  });
  it('REVERT: Close already closed Project', async () => {
    await instance.changeProjectStatus(41956, {
      from: accounts[0],
    });
    await truffleAssert.reverts(
      instance.changeProjectStatus(41956, {
        from: accounts[0],
      }),
      'Project does not exist or is already closed'
    );
  });
});
