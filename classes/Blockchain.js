/* eslint-disable no-await-in-loop */
require('dotenv').config();
const Web3C = require('web3');
const fs = require('fs');
const { createHash } = require('crypto');
const Transaction = require('ethereumjs-tx');

const web3 = new Web3C(process.env.BLOCKCHAIN || 'http://127.0.0.1:8545');
const NuclearPoEABI = 'build/contracts/NuclearPoE.json';
const ProjectABI = 'build/contracts/Project.json';
const ClientABI = 'build/contracts/Client.json';
const parsedProject = JSON.parse(fs.readFileSync(ProjectABI));
const parsedClient = JSON.parse(fs.readFileSync(ClientABI));
const parsed = JSON.parse(fs.readFileSync(NuclearPoEABI));
const parsedBin = fs.readFileSync('./contracts_NuclearPoE_sol_NuclearPoE.bin');
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

  async createNewNuclearPoE() {
    try {
      const newContract = new web3.eth.Contract(parsed.abi);
      newContract
        .deploy({ data: parsedBin.toString() })
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

  createHash(file) {
    this.file = file;
    this.documentHash = `0x${createHash('sha256')
      .update(this.file.buffer)
      .digest('hex')}`;
    return this;
  }

  get getHash() {
    return this.documentHash;
  }

  /**
   * Prepara la transacción
   * @name addDocHash
   * @function
   * @memberof Blockchain
   */
  async addDocument(contractAddress, _supplierAddress, _documentName) {
    const proyectoContract = new web3.eth.Contract(
      parsedProject.abi,
      contractAddress
    );

    const documentName = web3.utils.fromAscii(_documentName);
    const supplierAddress = web3.utils.toChecksumAddress(_supplierAddress);

    this.data = proyectoContract.methods
      .addDocument(supplierAddress, this.documentHash, documentName)
      .encodeABI();
    this.gaslimit = await proyectoContract.methods
      .addDocument(supplierAddress, this.documentHash, documentName)
      .estimateGas({ from: this.wallet });
    return this;
  }

  async findDocument(contractAddress) {
    const proyectoContract = new web3.eth.Contract(
      parsedProject.abi,
      contractAddress
    );
    this.document = await proyectoContract.methods
      .findDocument(this.documentHash)
      .call();
    return this;
  }

  async addProject(expediente, _projectTitle, _clientAddress, _clientName) {
    // Validate and convert input data
    if (typeof expediente !== 'number')
      throw TypeError(`Expediente is not a number`);

    if (typeof _projectTitle !== 'string')
      throw TypeError(`Project Title is not a string`);

    if (typeof _clientName !== 'string')
      throw TypeError(`Client Name is not a string`);

    const projectTitle = web3.utils.fromAscii(_projectTitle);
    const clientAddress = web3.utils.toChecksumAddress(_clientAddress);
    const clientName = web3.utils.fromAscii(_clientName);

    // Prepare data package and estimate gas cost
    this.data = contract.methods
      .createProject(expediente, projectTitle, clientAddress, clientName)
      .encodeABI();
    this.gaslimit = await contract.methods
      .createProject(expediente, projectTitle, clientAddress, clientName)
      .estimateGas({ from: this.wallet });
    return this;
  }

  async getProcess(contractAddress) {
    const proyectoContract = new web3.eth.Contract(
      parsedProject.abi,
      contractAddress
    );
    const processCount = await proyectoContract.methods.supplierCount().call();
    this.processList = [];
    for (let i = 0; i < processCount; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const supplierAddress = await proyectoContract.methods
        .supplierAddresses(i)
        .call();
      // eslint-disable-next-line no-await-in-loop
      const process = await proyectoContract.methods
        .process(supplierAddress)
        .call();
      process.processName = web3.utils.toAscii(process.processName);
      process.supplierName = web3.utils.toAscii(process.supplierName);
      this.processList.push(process);
    }
    return this;
  }

  async approveProject(contractAddress) {
    const proyectoContract = new web3.eth.Contract(
      parsedProject.abi,
      contractAddress
    );
    // Prepare data package and estimate gas cost
    this.data = proyectoContract.methods.approveProject().encodeABI();
    this.gaslimit = await proyectoContract.methods
      .approveProject()
      .estimateGas({ from: this.wallet });
    return this;
  }

  async contractDetails(contractAddress) {
    const proyectoContract = new web3.eth.Contract(
      parsedProject.abi,
      contractAddress
    );

    const result = await proyectoContract.methods.contractDetails().call();
    return {
      expediente: result[0],
      contractAddress: result[1],
      clientAddress: result[2],
      contractName: web3.utils.toAscii(result[3]),
      approved: result[4],
      allDocuments: result[5],
      allSuppliers: result[6]
    };
  }

  async getClientDetails() {
    const contrato = await contract.methods.clientContracts(this.wallet).call();
    this.clientContractAddress = contrato.contractAddress;
    const clientContract = new web3.eth.Contract(
      parsedClient.abi,
      this.clientContractAddress
    );

    const client = await clientContract.methods.contractDetails().call();
    const allClientProjects = client[1];
    this.clientsProjects = [];
    for (let i = 0; i < allClientProjects.length; i += 1) {
      const result = this.contractDetails(allClientProjects[i]);
      this.clientsProjects.push(result);
    }
    this.clientsProjects = await Promise.all(this.clientsProjects);
    return this;
  }

  async returnDocuments(contractAddress) {
    const proyectoContract = new web3.eth.Contract(
      parsedProject.abi,
      contractAddress
    );

    this.documentsQty = await proyectoContract.methods.documentQty().call();
    this.documents = [];
    for (let i = 0; i < this.documentsQty; i += 1) {
      const document = await proyectoContract.methods.allDocuments(i).call();
      const documentDetails = await proyectoContract.methods
        .findDocument(document)
        .call();
      this.documents.push(documentDetails);
    }
    return this;
  }

  async addProcess(
    contractAddress,
    supplierAddress,
    processTitle,
    supplierName
  ) {
    if (typeof processTitle !== 'string')
      throw TypeError(`Title of Process is not a string`);

    if (typeof supplierName !== 'string')
      throw TypeError(`Name of supplier is not a string`);

    const proyectoContract = new web3.eth.Contract(
      parsedProject.abi,
      contractAddress
    );
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

  async returnAllProjects() {
    const cantidadProjectos = await contract.methods.projectCount().call();
    this.projectos = [];
    for (let i = 0; i < cantidadProjectos; i += 1) {
      const result = await contract.methods.projectContractsArray(i).call();
      const details = await this.contractDetails(result);
      this.projectos.push(details);
    }
    return this;
  }

  /**
   * Emite la transacción y espera respuesta
   * @name sendTx
   * @function
   * @memberof Blockchain
   */
  // eslint-disable-next-line consistent-return
  async sendTx(contractAddress = process.env.SCADDRESS) {
    let rawTx;
    let serializedTx;
    try {
      const gasprice = await web3.eth.getGasPrice();
      const nonce = await web3.eth.getTransactionCount(this.wallet);

      rawTx = {
        nonce: web3.utils.toHex(nonce),
        gasPrice: web3.utils.toHex(gasprice),
        gasLimit: web3.utils.toHex(this.gaslimit),
        to: contractAddress,
        value: '0x00',
        data: this.data
      };

      const tx = new Transaction(rawTx);
      tx.sign(this.private);
      serializedTx = tx.serialize();

      web3.eth
        .sendSignedTransaction(`0x${serializedTx.toString('hex')}`)
        .on('receipt', receipt => {
          return receipt;
        })
        .on('error', error => {
          return error;
        });
    } catch (e) {
      return e;
    }
  }
}
module.exports = Blockchain;
