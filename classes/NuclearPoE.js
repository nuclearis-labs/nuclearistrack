/* eslint-disable no-underscore-dangle */
/* eslint-disable no-await-in-loop */
const fs = require('fs');
const web3 = require('web3');
const Contract = require('./Contract');
const Project = require('./Project');
const utils = require('../functions/utils');

const NuclearPoEBin = fs.readFileSync('temp/__NuclearPoE_sol_NuclearPoE.bin');
const nuclearPoEABI = JSON.parse(
  fs.readFileSync('build/contracts/NuclearPoE.json')
).abi;

class NuclearPoE extends Contract {
  constructor(wallet, privateKey) {
    super(wallet, privateKey);
    this.instance = this.initiateContract(nuclearPoEABI, process.env.SCADDRESS);
  }

  async addProject(_expediente, _projectTitle, _clientAddress) {
    try {
      utils.isValidAddress(_clientAddress);
      utils.isString(_projectTitle);

      // Validate and convert input data
      const expediente = utils.isNumber(_expediente);
      const projectTitle = utils.toBytes32(_projectTitle);
      const clientAddress = utils.toChecksumAddress(_clientAddress);

      // Prepare data package and estimate gas cost
      this.data = this.instance.methods
        .createProject(expediente, projectTitle, clientAddress)
        .encodeABI();
      this.gaslimit = await this.instance.methods
        .createProject(expediente, projectTitle, clientAddress)
        .estimateGas({ from: this.wallet });
      this.result = await this.sendTx('CreateProject');

      return {
        expediente,
        projectTitle: _projectTitle,
        clientAddress: _clientAddress,
        contractAddress: this.result.returnValues.newProjectContractAddress,
        transactionHash: this.result.transactionHash,
        blockNumber: this.result.blockNumber
      };
    } catch (e) {
      throw Error(e);
    }
  }

  // ATENTION! Temporal method for testing..
  async createNewNuclearPoE() {
    try {
      const newContract = new web3.eth.Contract(nuclearPoEABI);
      newContract
        .deploy({ data: NuclearPoEBin.toString() })
        .send({
          from: '0x59484aA6E2C33B96E541CfC6Ce0d59c18f7b7Bb1',
          gas: 5000000,
          gasPrice: 0
        })
        .then(newContractInstance => {
          this.NuclearPoEAddress = newContractInstance.options.address;
        });
      return this;
    } catch (e) {
      throw Error('Problem deploying NuclearPoE Contract');
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

  async createThirdParty(_address, _name, _type, _event) {
    try {
      utils.isValidAddress(_address);
      utils.isString(_name);

      // Validate and convert input data
      const clientAddress = utils.toChecksumAddress(_address);
      const clientName = utils.toBytes32(_name);

      // Prepare data package and estimate gas cost
      this.data = this.instance.methods[_type](
        clientAddress,
        clientName
      ).encodeABI();
      this.gaslimit = await this.instance.methods[_type](
        clientAddress,
        clientName
      ).estimateGas({ from: this.wallet });
      this.result = await this.sendTx(_event);

      return {
        contractAddress: this.result.returnValues.ContractAddress,
        transactionHash: this.result.transactionHash,
        blockNumber: this.result.blockNumber
      };
    } catch (e) {
      throw Error(e);
    }
  }
}

module.exports = NuclearPoE;
