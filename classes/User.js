const Contract = require('./Contract');
const utils = require('../functions/utils');
const userABI = require('../build/contracts/User.json').abi;
const Transaction = require('../functions/transaction');

class User extends Contract {
  constructor(address, privateKey, contractAddress) {
    super(userABI, contractAddress);
    this.address = address;
    this.privateKey = Buffer.from(privateKey, 'hex');
    this.instance = this.initiateContract();
  }

  async getUserDetails() {
    const transaction = new Transaction(this, 'contractDetails');
    const result = await transaction.call();
    return result;
  }
}
module.exports = User;
