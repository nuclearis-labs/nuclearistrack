const Contract = require('./Contract');
const utils = require('../functions/utils');
const userABI = require('../build/contracts/User.json').abi;
const Transaction = require('./Transaction');

class User extends Contract {
  constructor(address, privateKey, contractAddress) {
    super(userABI, contractAddress);
    this.address = address;
    this.privateKey = privateKey;
    this.initiateContract();
  }

  async getUserDetails() {
    const tx = new Transaction(this.instance, this.address, 'contractDetails');
    return await tx.call();
  }
}
module.exports = User;
