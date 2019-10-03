/* eslint-disable no-underscore-dangle */
/* eslint-disable no-await-in-loop */
const fs = require('fs');
const Web3 = require('web3');
const Contract = require('./Contract');
const Project = require('./Project');
const utils = require('../functions/utils');

const web3 = new Web3(
  new Web3.providers.WebsocketProvider('ws://127.0.0.1:8545')
);

const NuclearPoEBin = JSON.parse(
  fs.readFileSync('build/contracts/NuclearPoE.json')
).bytecode;
const nuclearPoEABI = JSON.parse(
  fs.readFileSync('build/contracts/NuclearPoE.json')
).abi;

class NuclearPoE extends Contract {
  constructor(wallet, privateKey) {
    super(wallet, privateKey, nuclearPoEABI);
  }

  async addProject(_expediente, _projectTitle, _clientAddress) {
    try {
      this.data = this.instance.methods
        .createProject(expediente, projectTitle, clientAddress)
        .encodeABI();
      this.gaslimit = await this.instance.methods
        .createProject(expediente, projectTitle, clientAddress)
        .estimateGas({ from: this.wallet });
      this.result = await this.sendTx();

      return {
        result: this.result
      };
    } catch (e) {
      throw Error(e);
    }
  }

  // ATENTION! Temporal method for testing..
  async createNewNuclearPoE(privKey) {
    try {
      const newContract = new web3.eth.Contract(nuclearPoEABI);
      const account = web3.eth.accounts.wallet.add(privKey);

      const tx = new Promise((resolve, reject) => {
        newContract
          .deploy({ data: NuclearPoEBin.toString() })
          .send({
            from: account.address,
            gas: 9000000,
            gasPrice: 0
          })
          .on('error', error => reject(error))
          .then(newContractInstance => {
            resolve(newContractInstance.options.address);
          });
      });

      const txResolved = await tx;
      return txResolved;
    } catch (e) {
      throw Error(e);
    }
  }

  async returnAllProjects() {
    const cantidadProjectos = await this.instance.methods.projectCount().call();
    const result = [];
    for (let i = 0; i < cantidadProjectos; i += 1) {
      const contractAddress = await this.instance.methods
        .projectContractsArray(i)
        .call();
      const project = new Project(contractAddress);
      const details = utils.convertResult(await project.getDetails());
      result.push({
        expediente: details[0],
        contractAddress: details[1],
        clientAddress: details[2],
        projectTitle: details[3],
        approved: details[4],
        allDocuments: details[5],
        allSuppliers: details[6]
      });
    }
    return result;
  }

  async createThirdParty(_address, _name, _type) {
    try {
      this.data = this.instance.methods[_type](
        clientAddress,
        clientName
      ).encodeABI();
      this.gaslimit = await this.instance.methods[_type](
        clientAddress,
        clientName
      ).estimateGas({ from: this.wallet });
      this.result = await this.sendTx();

      return {
        transactionHash: this.result.transactionHash,
        blockNumber: this.result.blockNumber
      };
    } catch (e) {
      throw Error(e);
    }
  }
}

module.exports = NuclearPoE;
