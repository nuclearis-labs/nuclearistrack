const Contract = require('./Contract');
const utils = require('../functions/utils');
const nuclearPoEABI = require('../build/contracts/NuclearPoE.json').abi;
const Transaction = require('./Transaction');

class User extends Contract {
  constructor(address, privateKey) {
    super(nuclearPoEABI);
    this.address = address;
    this.privateKey = privateKey;
    this.initiateContract();
  }

  async getUserDetails(address) {
    const tx = new Transaction(this.instance, this.address, 'getUserDetails', [
      address
    ]);
    return await tx.call();
  }
}
module.exports = User;
