const NuclearPoE = artifacts.require('../contracts/NuclearPoE.sol');
const Process = artifacts.require('../contracts/Process.sol');
const RoleBasedAcl = artifacts.require('../contracts/RoleBasedAcl.sol');
const { assert } = require('chai');
const truffleAssert = require('truffle-assertions');
const web3 = require('web3');

contract('Process', accounts => {
  let instance;
  let processAddress;
  let processInstance;
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
  });

  it('REVERT: Create new process without the correct role', async () => {
    await truffleAssert.reverts(
      instance.createProcess(accounts[2], web3.utils.asciiToHex('Mecanizado'), {
        from: accounts[1]
      }),
      'Sender does not have the correct role'
    );
  });

  it('EVENT: Add a process', async () => {
    await roleInstance.assignRole(accounts[0], 'process:create', {
      from: accounts[0]
    });
    const result = await instance.createProcess(
      accounts[2],
      web3.utils.asciiToHex('Mecanizado')
    );

    processAddress = result.logs[0].args[0];
    processInstance = await Process.at(processAddress);

    truffleAssert.eventEmitted(result, 'CreateProcess');
  });

  it('Get Process Details', async () => {
    await roleInstance.assignRole(accounts[0], 'process:read', {
      from: accounts[0]
    });
    const result = await processInstance.getDetails();
    assert(result[0], accounts[2]);
    assert(result[1], web3.utils.asciiToHex('Mecanizado'));
    assert(result[2], []);
    assert(result[3], processAddress);
  });

  it('Get All Documents', async () => {
    await roleInstance.assignRole(accounts[0], 'process:read', {
      from: accounts[0]
    });
    const result = await processInstance.getDetails({ from: accounts[0] });
    assert(result, []);
  });
});
