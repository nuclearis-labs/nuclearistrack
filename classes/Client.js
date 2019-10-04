const fs = require('fs');
const Contract = require('./Contract');
const utils = require('../functions/utils');
const clientABI = require('../build/contracts/Client.json').abi;

class Client extends Contract {
  constructor(address, wallet, privateKey) {
    super(wallet, privateKey);
    this.address = address;
    this.instance = this.initiateContract(clientABI, address);
  }

  async getClientDetails() {
    const result = utils.convertResult(await this.getDetails());
    return { clientName: utils.toAscii(result[0]), allProjects: result[1] };
  }
}
module.exports = Client;
