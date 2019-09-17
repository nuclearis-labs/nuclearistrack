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
  async addDocHash(supplier, documentTitle, contractAddr) {
    const contract = new web3.eth.Contract(parsedProject.abi, contractAddr);
    /*     const hash = bs58.decode(IPFSHash).toString('hex');
    const storageFunction = hash.slice(0, 2);
    const storageSize = hash.slice(2, 4);
    const storageHash = hash.slice(4); */
    const title = web3.utils.fromAscii(documentTitle);

    this.data = contract.methods
      .addDocument(supplier, this.fileHash, title)
      .encodeABI();
    this.gaslimit = await contract.methods
      .addDocument(supplier, this.fileHash, title)
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
    this.projectContractAddress = contratoExpediente.contractAddress;
    let proyectoContract = new web3.eth.Contract(
      parsedProject.abi,
      this.projectContractAddress
    );

    // Prepare data package and estimate gas cost
    this.data = proyectoContract.methods.approveProject().encodeABI();
    this.gaslimit = await proyectoContract.methods
      .approveProject()
      .estimateGas({ from: this.wallet });
    return this;
  }

  async contractDetails(expediente) {
    let contratoExpediente = await contract.methods
      .projectContracts(expediente)
      .call();

    const contractProjecto = new web3.eth.Contract(
      parsedProject.abi,
      contratoExpediente.contractAddress
    );
    let result = await contractProjecto.methods.contractDetails().call();
    this.contractDetails = {
      expediente: result[0],
      contractName: web3.utils.toAscii(result[1])
    };
    return this;
  }

  async returnDocuments(contractAddr) {
    const contract = new web3.eth.Contract(parsedProject.abi, contractAddr);
    this.data = await contract.methods.returnDocument().call();

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
          .on('receipt', returnTx => {
            this.receipt = returnTx;
            resolve(this);
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
