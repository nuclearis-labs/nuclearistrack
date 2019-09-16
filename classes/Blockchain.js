require('dotenv').config();
const Web3C = require('web3');
const fs = require('fs');
const { createHash } = require('crypto');
const bs58 = require('bs58');
const Transaction = require('ethereumjs-tx');
const documentModel = require('../models/document');

const web3 = new Web3C(process.env.BLOCKCHAIN || 'http://127.0.0.1:7545');
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
    // const jsonKeys = JSON.parse(keys);
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
   * Getter of hash value
   * @name getHash
   * @function
   * @memberof Blockchain
   */
  get getHash() {
    return this.fileHash;
  }

  /**
   * Busca el hash del documento en el contrato inteligente
   * @name findBlock
   * @function
   * @memberof Blockchain
   */
  async findBlock() {
    const result = await contract.methods
      .findDocHash(this.fileHash)
      .call({ from: this.wallet });
    const blockNumber = result[1];
    const mineTime = result[0];

    if (blockNumber === '0') {
      this.foundBlock = {
        mineTime: new Date(mineTime * 1000),
        blockNumber
      };
      return this;
    }
    this.foundBlock = {
      mineTime: new Date(mineTime * 1000),
      blockNumber
    };

    return this;
  }

  /**
   * Prepara la transacción
   * @name addDocHash
   * @function
   * @memberof Blockchain
   */
  async addDocHash(expediente, documentTitle, IPFSHash) {
    const hash = bs58.decode(IPFSHash).toString('hex');
    const storageFunction = hash.slice(0, 2);
    const storageSize = hash.slice(2, 4);
    const storageHash = hash.slice(4);

    this.data = contract.methods
      .addDocument(
        this.fileHash,
        expediente,
        342343,
        documentTitle,
        Number(storageHash),
        Number(storageFunction),
        Number(storageSize)
      )
      .encodeABI();
    this.gaslimit = await contract.methods
      .addDocument(
        this.fileHash,
        expediente,
        342343,
        documentTitle,
        storageHash,
        storageFunction,
        storageSize
      )
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

  async approveProject(expediente) {
    // Validate and convert input data
    if (typeof expediente !== 'number')
      throw TypeError(`Expediente is not a number`);

    let contratoExpediente = await contract.methods
      .projectContracts(expediente)
      .call();
    console.log(contratoExpediente.contractAddress);

    let proyectoContract = new web3.eth.Contract(
      parsedProject.abi,
      contratoExpediente.contractAddress
    );
    console.log(proyectoContract);

    // Prepare data package and estimate gas cost
    this.data = proyectoContract.methods.approveProject().encodeABI();
    this.gaslimit = await proyectoContract.methods
      .approveProject()
      .estimateGas({ from: this.wallet });
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

    const title = web3.utils.fromAscii(processTitle);
    const address = web3.utils.toChecksumAddress(supplierAddress);
    const name = web3.utils.fromAscii(supplierName);
    // Prepare data package and estimate gas cost
    this.data = contract.methods
      .addProcessToProject(address, expediente, title, name)
      .encodeABI();
    this.gaslimit = await contract.methods
      .addProcessToProject(address, expediente, title, name)
      .estimateGas({ from: this.wallet });
    return this;
  }

  /**
   * Emite la transacción y espera respuesta
   * @name sendTx
   * @function
   * @memberof Blockchain
   */
  sendTx(contract) {
    return new Promise(async (resolve, reject) => {
      const gasprice = await web3.eth.getGasPrice();
      const nonce = await web3.eth.getTransactionCount(this.wallet);

      const rawTx = {
        nonce: web3.utils.toHex(nonce),
        gasPrice: web3.utils.toHex(gasprice),
        gasLimit: web3.utils.toHex(this.gaslimit),
        to: contract,
        value: '0x00',
        data: this.data
      };

      const tx = new Transaction(rawTx);
      tx.sign(this.private);
      const serializedTx = tx.serialize();

      web3.eth
        .sendSignedTransaction(`0x${serializedTx.toString('hex')}`)
        .on('transactionHash', returnTx => {
          this.transactionHash = returnTx;
          resolve(this);
        })
        .on('error', error => {
          reject(error);
        });
    });
  }
}
module.exports = Blockchain;
