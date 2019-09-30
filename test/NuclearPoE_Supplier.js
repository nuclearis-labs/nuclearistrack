/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable node/no-unpublished-require */

const NuclearPoE = artifacts.require('../contracts/NuclearPoE.sol');
const Supplier = artifacts.require('../contracts/Supplier.sol');
const { assert } = require('chai');
const truffleAssert = require('truffle-assertions');

const web3 = require('web3');

contract('Supplier Contracts', accounts => {
  let instance;
  let supplierInstance;
  before(async () => {
    instance = await NuclearPoE.deployed();
  });

  it('REVERT: Create new supplier as non-owner', async () => {
    await truffleAssert.reverts(
      instance.createSupplier(accounts[2], web3.utils.fromAscii('IMECO'), {
        from: accounts[1]
      }),
      'Only owner can make this change'
    );
  });

  it('Create supplier', async () => {
    const result = await instance.createSupplier(
      accounts[2],
      web3.utils.fromAscii('IMECO')
    );
    supplierInstance = await Supplier.at(result.logs[0].args[0]);
    truffleAssert.eventEmitted(result, 'CreateSupplier', ev => {
      return ev.ContractAddress;
    });
  });

  it('REVERT: Create duplicate supplier', async () => {
    await truffleAssert.reverts(
      instance.createSupplier(accounts[2], web3.utils.fromAscii('IMECO')),
      'Supplier already created'
    );
  });

  it('Return supplier projects', async () => {
    const contractDetails = await supplierInstance.contractDetails();
    assert.include(contractDetails[0], web3.utils.fromAscii('IMECO'));
  });

  after(async () => {
    await instance.kill({ from: accounts[0] });
    await supplierInstance.kill({ from: accounts[0] });
  });
});
