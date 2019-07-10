const Web3 = require("web3"),
  fs = require("fs"),
  Document = require("../models/document"),
  logger = require("../services/winston"),
  ethereumjs = require("ethereumjs-tx");

// ***************************** DECLARAR VARIABLES *********************************
var contract = undefined;
var walletaddress =
  process.env.RSKadress || "0x7bBd83b988479F8eC82756f58e9ea8B54De103e4";
var SCaddress =
  process.env.SCadress || "0x2214c4A7c9f0A603Bd13AF2eA37089E456F0Caa4";
var privateKey = new Buffer.from(
  process.env.RSKprivkey ||
    "b6679ffaf50f7a4332855238fe0fae5fa19dd8afc7d90eb63decba74c21bed59",
  "hex"
);
//https://public-node.testnet.rsk.co:443

// ***************************** ARMAR ENVIROMENT *********************************

const web3 = new Web3(
  Web3.givenProvider || process.env.blockchain || "http://127.0.0.1:7545"
);

var jsonFile = "build/contracts/MO.json";
var parsed = JSON.parse(fs.readFileSync(jsonFile));
var abi = parsed.abi;

contract = new web3.eth.Contract(abi, SCaddress);

// ***************************** ENVIAR HASH *********************************

module.exports.send = async function send(fileHash) {
  return new Promise(async (resolve, reject) => {
    let serializedTx = await preparetx(fileHash);
    web3.eth
      .sendSignedTransaction("0x" + serializedTx.toString("hex"))
      .on("transactionHash", tx => {
        logger.log({
          level: "info",
          message: `Se envío la transacción ${tx}`
        });
        resolve(tx);
      })
      .on("receipt", ({ transactionHash, blockHash, blockNumber }) => {
        logger.log({
          level: "info",
          message: `Se recibio el receipt de la transacción
           TransactionHash: ${transactionHash}
           BlockHash: ${blockHash}
           BlockNumber: ${blockNumber}`
        });
        Document.findOneAndUpdate(
          { tx: transactionHash },
          { $set: { mined: true } },
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
  });
};

// ***************************** PREPARAR TRANSACCIÓN DE HASH *********************************

async function preparetx(hash) {
  let data = contract.methods.addDocHash(hash).encodeABI();

  let gasprice = await web3.eth.getGasPrice();
  let gaslimit = await contract.methods
    .addDocHash(hash)
    .estimateGas({ from: walletaddress });

  let nonce = await web3.eth.getTransactionCount(walletaddress);

  const rawTx = {
    nonce: web3.utils.toHex(nonce),
    gasPrice: web3.utils.toHex(gasprice),
    gasLimit: web3.utils.toHex(gaslimit),
    to: SCaddress,
    value: "0x00",
    data: data
  };

  let tx = new ethereumjs(rawTx);
  tx.sign(privateKey);
  return tx.serialize();
}

// ***************************** BUSCAR HASH *********************************

module.exports.find = async function find(hash) {
  let result = await contract.methods.findDocHash(hash).call({ from: account });
  let blockNumber = result[1];

  return blockNumber === "0"
    ? false
    : {
        mineTime: new Date(result[0] * 1000),
        blockNumber: result[1]
      };
};

// ***************************** CHEQUEAR DB CONTRA HASH Y BLOCKCHAIN *********************************

module.exports.check = async function check(resultObj, fileHash) {
  let doc = await Document.findOne({ hash: fileHash });
  logger.log({
    level: "info",
    message: `Se chequeo el estado de un documento
     FileHash: ${fileHash}
     Resultado Blockchain: ${resultObj ? true : false}
     Resultado DB: ${doc}`
  });
  return {
    fileHash: fileHash,
    result: resultObj,
    doc: doc
  };
};
