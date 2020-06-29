const NuclearPoE = artifacts.require('../NuclearPoE.sol');
const Process = artifacts.require('../Process.sol');
const truffleAssert = require('truffle-assertions');

contract('Create Process', (accounts) => {
  let instance;
  let processAddress;
  let processInstance3;
  before(async () => {
    instance = await NuclearPoE.new(accounts[0]);
    await instance.createProject(
      41955,
      accounts[1],
      web3.utils.asciiToHex('Conjunto Soporte'),
      web3.utils.asciiToHex('23423423 / 23423423')
    );
  });

  it('REVERT: Create a new process as non-owner', async () => {
    await truffleAssert.reverts(
      instance.createProcess(accounts[2], web3.utils.asciiToHex('Mecanizado'), {
        from: accounts[1],
      })
    );
  });
  it('EVENT: Create a new process', async () => {
    const result = await instance.createProcess(
      accounts[2],
      web3.utils.asciiToHex('Mecanizado')
    );

    processAddress = result.logs[0].args[0];
    processInstance3 = await Process.at(processAddress);

    truffleAssert.eventEmitted(result, 'CreateProcess');
  });
});

contract('Return Processes', (accounts) => {
  let instance;
  let processAddress;
  let processInstance1;
  let processInstance2;
  let processInstance3;
  before(async () => {
    instance = await NuclearPoE.new(accounts[0]);
    await instance.createProject(
      41955,
      accounts[1],
      web3.utils.asciiToHex('Conjunto Soporte'),
      web3.utils.asciiToHex('23423423 / 23423423')
    );
    const process1 = await instance.createProcess(
      accounts[2],
      web3.utils.asciiToHex('Mecanizado 2019')
    );
    const process2 = await instance.createProcess(
      accounts[2],
      web3.utils.asciiToHex('Mecanizado 2020')
    );
    const process3 = await instance.createProcess(
      accounts[3],
      web3.utils.asciiToHex('Plateado')
    );
    processAddress1 = process1.logs[0].args[0];
    processInstance1 = await Process.at(processAddress1);
    processAddress2 = process2.logs[0].args[0];
    processInstance2 = await Process.at(processAddress2);
    processAddress3 = process3.logs[0].args[0];
    processInstance3 = await Process.at(processAddress3);

    await instance.addProcessToProject(41955, processAddress1);
    await instance.addProcessToProject(41955, processAddress3);
  });

  it('Return process contracts as owner', async () => {
    const result = await instance.getProcessesByAddress({
      from: accounts[0],
    });
    assert.lengthOf(result, 3, 'Result should be an array of 3 processes');
  });

  it('Return process contracts as supplier', async () => {
    const result = await instance.getProcessesByAddress({
      from: accounts[2],
    });
    assert.lengthOf(result, 2, 'Result should be an array of 2 processes');
  });

  it('Return empty array if called by address without corresponding processes', async () => {
    const result = await instance.getProcessesByAddress({
      from: accounts[4],
    });
    assert.lengthOf(result, 0, 'Result should be an empty array');
  });

  it('REVERT: Return process contracts by project as non-owner or non-client', async () => {
    await truffleAssert.reverts(
      instance.getProcessContractsByProject(41955, {
        from: accounts[4],
      }),
      'Project and Client do not match'
    );
  });

  it('Return process contracts by project as owner', async () => {
    const result = await instance.getProcessContractsByProject(41955, {
      from: accounts[0],
    });
    assert.lengthOf(result, 2, 'Array has to have two process assigned');
  });

  it('Return process contracts by project as client', async () => {
    const result = await instance.getProcessContractsByProject(41955, {
      from: accounts[1],
    });
    assert.lengthOf(result, 2, 'Array has to have one process assigned');
  });

  it('REVERT: Get Process Details as non-supplier or non-owner', async () => {
    await truffleAssert.reverts(
      processInstance3.getDetails({ from: accounts[4] }),
      'User has to be assigned client or owner'
    );
  });

  it('Get Process Details as owner', async () => {
    const result = await processInstance3.getDetails({ from: accounts[0] });
    assert.deepEqual(result, {
      '0': accounts[3],
      '1': web3.utils.padRight(web3.utils.asciiToHex('Plateado'), 64),
      '2': [],
      '3': processAddress3,
    });
  });

  it('Get Process Details as assigned supplier', async () => {
    const result = await processInstance3.getDetails({ from: accounts[3] });
    assert.deepEqual(result, {
      '0': accounts[3],
      '1': web3.utils.padRight(web3.utils.asciiToHex('Plateado'), 64),
      '2': [],
      '3': processAddress3,
    });
  });
});
