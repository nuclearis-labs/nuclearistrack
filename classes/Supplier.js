const fs = require('fs');
const Contract = require('./Contract');
const utils = require('../functions/utils');

const supplierABI = JSON.parse(fs.readFileSync('build/contracts/Supplier.json'))
  .abi;

class Supplier extends Contract {
  constructor(address, wallet, privateKey) {
    super(wallet, privateKey);

    this.instance = this.initiateContract(supplierABI, address);
  }

  async getSupplierDetails() {
    const result = utils.convertResult(await this.getDetails());
    return { supplierName: utils.toAscii(result[0]), allProjects: result[1] };
  }
}
module.exports = Supplier;
