require('dotenv').config();
const Web3C = require('web3');
const fs = require('fs');
const { createHash } = require('crypto');
const bs58 = require('bs58');
const Transaction = require('ethereumjs-tx');
const documentModel = require('../models/document');

const web3 = new Web3C(process.env.BLOCKCHAIN || 'http://127.0.0.1:8545');
const NuclearPoEABI = 'build/contracts/NuclearPoE.json';
const ProjectABI = 'build/contracts/Project.json';
const parsedProject = JSON.parse(fs.readFileSync(ProjectABI));
const parsed = JSON.parse(fs.readFileSync(NuclearPoEABI));
const contract = new web3.eth.Contract(parsed.abi, process.env.SCADDRESS);

/**
 * @name Blockchain
 * @desc Parent Class of Documento with Blockchain functions
 * @namespace
 * @constructor
 */
class Blockchain {
  constructor(wallet, privateKey) {
    const privateBuffer = Buffer.from(privateKey, 'hex');
    this.wallet = wallet;
    this.private = privateBuffer;
  }
  /**
   * Crea el hash del archivo
   * @name createHash
   * @function
   * @memberof Blockchain
   */

  createHash(file) {
    this.file = file;
    this.fileHash = `0x${createHash('sha256')
      .update(this.file.buffer)
      .digest('hex')}`;
    return this;
  }

  /**
   * Prepara la transacción
   * @name addDocHash
   * @function
   * @memberof Blockchain
   */
  async addDocHash(expediente, supplier, documentTitle, contractAddr) {
    const proyectoContract = await this.getProjectContractInstance(expediente);

    const title = web3.utils.fromAscii(documentTitle);
    const address = web3.utils.toChecksumAddress(supplier);

    this.data = proyectoContract.methods
      .addDocument(address, this.fileHash, title)
      .encodeABI();
    this.gaslimit = await proyectoContract.methods
      .addDocument(address, this.fileHash, title)
      .estimateGas({ from: this.wallet });
    return this;
  }

  async addProject(expediente, projectTitle, clientAddress, clientName) {
    // Validate and convert input data
    if (typeof expediente !== 'number')
      throw TypeError(`Expediente is not a number`);

    if (typeof projectTitle !== 'string')
      throw TypeError(`Project Title is not a string`);

    if (typeof clientName !== 'string')
      throw TypeError(`Client Name is not a string`);

    const title = web3.utils.fromAscii(projectTitle);
    const address = web3.utils.toChecksumAddress(clientAddress);
    const name = web3.utils.fromAscii(clientName);

    // Prepare data package and estimate gas cost
    this.data = contract.methods
      .createProject(expediente, title, address, name)
      .encodeABI();
    this.gaslimit = await contract.methods
      .createProject(expediente, title, address, name)
      .estimateGas({ from: this.wallet });
    return this;
  }

  async getProjectContractInstance(expediente) {
    let contratoExpediente = await contract.methods
      .projectContracts(expediente)
      .call();
    this.projectContractAddress = contratoExpediente.contractAddress;
    return new web3.eth.Contract(
      parsedProject.abi,
      this.projectContractAddress
    );
  }

  async getProcess(expediente) {
    const proyectoContract = await this.getProjectContractInstance(expediente);
    let processCount = await proyectoContract.methods.supplierCount().call();
    this.processList = [];
    for (let i = 0; i < processCount; i++) {
      let supplierAddress = await proyectoContract.methods
        .supplierAddresses(i)
        .call();
      let process = await proyectoContract.methods
        .process(supplierAddress)
        .call();
      process.processName = web3.utils.toAscii(process.processName);
      process.supplierName = web3.utils.toAscii(process.supplierName);
      this.processList.push(process);
    }
    return this;
  }

  async approveProject(expediente) {
    // Validate and convert input data
    if (typeof expediente !== 'number')
      throw TypeError(`Expediente is not a number`);

    const proyectoContract = await this.getProjectContractInstance(expediente);

    // Prepare data package and estimate gas cost
    this.data = proyectoContract.methods.approveProject().encodeABI();
    this.gaslimit = await proyectoContract.methods
      .approveProject()
      .estimateGas({ from: this.wallet });
    return this;
  }

  async contractDetails(expediente) {
    const proyectoContract = await this.getProjectContractInstance(expediente);

    let result = await proyectoContract.methods.contractDetails().call();
    this.contractDetails = {
      expediente: result[0],
      contractName: web3.utils.toAscii(result[1])
    };
    return this;
  }

  async returnDocuments(expediente) {
    const proyectoContract = await this.getProjectContractInstance(expediente);
    this.documentsQty = await proyectoContract.methods.documentQty().call();
    this.documents = [];
    for (let i = 0; i < this.documentsQty; i++) {
      let document = await proyectoContract.methods.allDocuments(i).call();
      let documentDetails = await proyectoContract.methods
        .findDocument(document)
        .call();
      this.documents.push(documentDetails);
    }
    return this;
  }

  async addProcess(expediente, supplierAddress, processTitle, supplierName) {
    // Validate and convert input data
    if (typeof expediente !== 'number')
      throw TypeError(`Expediente is not a number`);

    if (typeof processTitle !== 'string')
      throw TypeError(`Title of Process is not a string`);

    if (typeof supplierName !== 'string')
      throw TypeError(`Name of supplier is not a string`);

    const proyectoContract = await this.getProjectContractInstance(expediente);

    const title = web3.utils.fromAscii(processTitle);
    const address = web3.utils.toChecksumAddress(supplierAddress);
    const name = web3.utils.fromAscii(supplierName);
    // Prepare data package and estimate gas cost
    this.data = proyectoContract.methods
      .addProcess(address, title, name)
      .encodeABI();
    this.gaslimit = await proyectoContract.methods
      .addProcess(address, title, name)
      .estimateGas({ from: this.wallet });
    return this;
  }

  /**
   * Emite la transacción y espera respuesta
   * @name sendTx
   * @function
   * @memberof Blockchain
   */
  sendTx(contractAddr = process.env.SCADDRESS) {
    return new Promise(async (resolve, reject) => {
      let rawTx;
      let serializedTx;
      try {
        const gasprice = await web3.eth.getGasPrice();
        const nonce = await web3.eth.getTransactionCount(this.wallet);

        rawTx = {
          nonce: web3.utils.toHex(nonce),
          gasPrice: web3.utils.toHex(gasprice),
          gasLimit: web3.utils.toHex(this.gaslimit),
          to: contractAddr,
          value: '0x00',
          data: this.data
        };

        const tx = new Transaction(rawTx);
        tx.sign(this.private);
        serializedTx = tx.serialize();

        web3.eth
          .sendSignedTransaction(`0x${serializedTx.toString('hex')}`)
          .on('receipt', receipt => {
            resolve(receipt);
          })
          .on('error', error => {
            reject(error);
          });
      } catch (e) {
        reject(e);
      }
    });
  }
}
module.exports = Blockchain;
