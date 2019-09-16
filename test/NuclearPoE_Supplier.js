const NuclearPoE = artifacts.require('../contracts/NuclearPoE.sol');
const Project = artifacts.require('../contracts/Project.sol');
const Supplier = artifacts.require('../contracts/Supplier.sol');
const assert = require('chai').assert;

contract('Supplier Contracts', accounts => {
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

    await instance.addProcess(
      accounts[2],
      web3.utils.fromAscii('Mecanizado'),
      web3.utils.fromAscii('BGH')
    );
    await instance.approveProject({ from: accounts[1] });
    await instance.addDocument(
      accounts[2],
      '0x29b4c17ccd128acc8c9f3e02c9b60d72c76add107a87a230d7a87b62dc313dbd',
      web3.utils.fromAscii('Certificado'),
      { from: accounts[2] }
    );
  });
  it('Return projects process', async () => {
    let processCount = await instance.processCount();
    let result = {};

    for (let i = 0; i < processCount; i++) {
      let res = await instance.supplierAddresses(i);

      SupplierInstance = await Supplier.at(res);
      let contractDetails = await SupplierInstance.contractDetails();
      result[res] = {
        name: contractDetails[0]
      };

      /*       assert.nestedProperty(
        result[res],
        'name',
        'Result should be array of 2 projects'
      ); */
    }
    console.log(result);
  });
  after(async () => {
    await instance.kill({ from: accounts[0] });
  });
});
