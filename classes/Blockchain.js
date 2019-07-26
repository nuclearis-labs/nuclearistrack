const Web3 = require("web3"),
  fs = require("fs"),
  documentModel = require("../models/document"),
  logger = require("../services/winston"),
  { createHash } = require("crypto"),
  Transaction = require("ethereumjs-tx");

// ***************************** DECLARAR VARIABLES *********************************
const walletaddress = process.env.RSKadress || "0x7bbd83b988479f8ec82756f58e9ea8b54de103e4",
  SCaddress = process.env.SCadress || "0x2214c4A7c9f0A603Bd13AF2eA37089E456F0Caa4",
  privateKey = new Buffer.from(
    process.env.RSKprivkey || "b6679ffaf50f7a4332855238fe0fae5fa19dd8afc7d90eb63decba74c21bed59",
    "hex"
  );

// ***************************** ARMAR ENVIROMENT *********************************

const web3 = new Web3(process.env.blockchain || "http://127.0.0.1:7545"),
  jsonFile = "build/contracts/MO.json",
  parsed = JSON.parse(fs.readFileSync(jsonFile)),
  abi = parsed.abi,
  contract = new web3.eth.Contract(abi, SCaddress);
/**
 * @name Blockchain
 * @desc Parent Class of Documento with Blockchain functions
 * @namespace
 * @constructor
 */
class Blockchain {
  constructor(file) {
    this.file = file;
  }

  /**
   * Crea el hash del archivo
   * @name createHash
   * @function
   * @memberof Blockchain
   */
  createHash() {
    this.fileHash =
      "0x" +
      createHash("sha256")
        .update(this.file.buffer)
        .digest("hex");
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
   * Get db record
   * @name getRecord
   * @function
   * @memberof Blockchain
   */
  async getRecord() {
    this.record = await documentModel.findOne({ fileHash: this.getHash });
    return this;
  }

  /**
   * Busca el hash del documento en el contrato inteligente
   * @name findBlock
   * @function
   * @memberof Blockchain
   */
  async findBlock() {
    let result = await contract.methods.findDocHash(this.fileHash).call({ from: walletaddress });
    let blockNumber = result[1];
    let mineTime = result[0];

    if (blockNumber === "0") {
      this.foundBlock = {
        mineTime: new Date(mineTime * 1000),
        blockNumber: blockNumber
      };

      return this;
    }
    //await this.getRecord();
    this.foundBlock = {
      mineTime: new Date(mineTime * 1000),
      blockNumber: blockNumber
    };

    return this;
  }

  /**
   * Prepara la transacción
   * @name prepareTx
   * @function
   * @memberof Blockchain
   */
  async _prepareTx() {
    let data = contract.methods.addDocHash(this.fileHash).encodeABI();

    let gasprice = await web3.eth.getGasPrice();
    let gaslimit = await contract.methods.addDocHash(this.fileHash).estimateGas({ from: walletaddress });
    let nonce = await web3.eth.getTransactionCount(walletaddress);

    const rawTx = {
      nonce: web3.utils.toHex(nonce),
      gasPrice: web3.utils.toHex(gasprice),
      gasLimit: web3.utils.toHex(gaslimit),
      to: SCaddress,
      value: "0x00",
      data: data
    };

    let tx = new Transaction(rawTx);
    tx.sign(privateKey);
    return tx.serialize();
  }

  /**
   * Emite la transacción y espera respuesta
   * @name sendTx
   * @function
   * @memberof Blockchain
   */
  async sendTx() {
    let serializedTx = await this._prepareTx();
    web3.eth
      .sendSignedTransaction("0x" + serializedTx.toString("hex"))
      .on("transactionHash", tx => {
        logger.log({
          level: "info",
          message: `Se envío la transacción ${tx}`
        });
        this.transactionHash = tx;
        return this;
      })
      .on("receipt", ({ transactionHash, blockHash, blockNumber }) => {
        logger.log({
          level: "info",
          message: `Se recibio el receipt de la transacción
             TransactionHash: ${transactionHash}
             BlockHash: ${blockHash}
             BlockNumber: ${blockNumber}`
        });
        documentModel.findOneAndUpdate(
          { tx: transactionHash },
          { $set: { blockHash: blockHash, blockNumber: blockNumber } },
          (err, doc) => {
            if (err) {
              reject(err);
            }
          }
        );
      })
      .on("error", error => {
        reject(error);
      });
  }
}
module.exports = Blockchain;
