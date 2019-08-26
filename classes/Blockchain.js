const Web3 = require("web3"),
    fs = require("fs"),
    documentModel = require("../models/document"),
    { createHash } = require("crypto"),
    bs58 = require("bs58"),
    Transaction = require("ethereumjs-tx");

const web3 = new Web3(process.env.BLOCKCHAIN || "http://127.0.0.1:7545"),
    jsonFile = "build/contracts/NuclearPoE.json",
    parsed = JSON.parse(fs.readFileSync(jsonFile)),
    abi = parsed.abi,
    contract = new web3.eth.Contract(abi, process.env.SCADDRESS)
/**
 * @name Blockchain
 * @desc Parent Class of Documento with Blockchain functions
 * @namespace
 * @constructor
 */
class Blockchain {
    constructor(keys) {
        let jsonKeys = JSON.parse(keys)
        let privateBuffer = Buffer.from(jsonKeys.private, "hex")
        this.wallet = jsonKeys.wallet
        this.private = privateBuffer
    }
    /**
     * Crea el hash del archivo
     * @name createHash
     * @function
     * @memberof Blockchain
     */
    createHash(file) {
        this.file = file
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
        let result = await contract.methods
            .findDocHash(this.fileHash)
            .call({ from: this.wallet })
        let blockNumber = result[1]
        let mineTime = result[0]

        if (blockNumber === '0') {
            this.foundBlock = {
                mineTime: new Date(mineTime * 1000),
                blockNumber: blockNumber,
            }

            return this
        }
        this.foundBlock = {
            mineTime: new Date(mineTime * 1000),
            blockNumber: blockNumber,
        }

        return this
    }

    /**
     * Prepara la transacción
     * @name addDocHash
     * @function
     * @memberof Blockchain
     */
    async addDocHash(expediente, documentTitle, IPFSHash) {
        IPFSHash = bs58.decode(IPFSHash).toString("hex")
        let storageFunction = IPFSHash.slice(0, 2)
        let storageSize = IPFSHash.slice(2, 4)
        let storageHash = IPFSHash.slice(4)
        console.log(storageFunction, storageSize, storageHash);

        this.data = contract.methods.addDocument(this.fileHash, expediente, 342343, documentTitle, Number(storageHash), Number(storageFunction), Number(storageSize)).encodeABI()
        this.gaslimit = await contract.methods
            .addDocument(this.fileHash, expediente, 342343, documentTitle, storageHash, storageFunction, storageSize)
            .estimateGas({ from: this.wallet })
        return this
    }

    checkForInputType(input, type) {
        if (input === undefined) {
            throw Error("Input undefined")
        }
        if (typeof input !== type) {
            throw Error(`Input is not a ${type}`)
        }
    }

    async addProject(expediente, projectTitle, clientAddress, clientName) {
        //Validate and convert input data
        this.checkForInputType(expediente, "number")
        this.checkForInputType(projectTitle, "string")
        this.checkForInputType(clientName, "string")
        projectTitle = web3.utils.fromAscii(projectTitle)
        clientAddress = web3.utils.toChecksumAddress(clientAddress)
        clientName = web3.utils.fromAscii(clientName)

        //Prepare data package and estimate gas cost
        this.data = contract.methods
            .createNewProject(expediente, projectTitle, clientAddress, clientName)
            .encodeABI()
        this.gaslimit = await contract.methods
            .createNewProject(expediente, projectTitle, clientAddress, clientName)
            .estimateGas({ from: this.wallet })
        return this
    }

    async approveProject(expediente) {
        //Validate and convert input data
        this.checkForInputType(expediente, "number")
        //Prepare data package and estimate gas cost
        this.data = contract.methods
            .approveProject(expediente)
            .encodeABI()
        this.gaslimit = await contract.methods
            .approveProject(expediente)
            .estimateGas({ from: this.wallet })
        return this
    }

    async addProcess(expediente, supplierAddress, processTitle, supplierName) {
        //Validate and convert input data
        this.checkForInputType(expediente, "number")
        this.checkForInputType(processTitle, "string")
        this.checkForInputType(supplierName, "string")
        processTitle = web3.utils.fromAscii(processTitle)
        supplierAddress = web3.utils.toChecksumAddress(supplierAddress)
        supplierName = web3.utils.fromAscii(supplierName)
        //Prepare data package and estimate gas cost
        this.data = contract.methods
            .addProcessToProject(supplierAddress, expediente, processTitle, supplierName)
            .encodeABI()
        this.gaslimit = await contract.methods
            .addProcessToProject(supplierAddress, expediente, processTitle, supplierName)
            .estimateGas({ from: this.wallet })
        return this
    }

    /**
     * Emite la transacción y espera respuesta
     * @name sendTx
     * @function
     * @memberof Blockchain
     */
    async sendTx() {
        return new Promise(async (resolve, reject) => {
            let gasprice = await web3.eth.getGasPrice()
            let nonce = await web3.eth.getTransactionCount(this.wallet)

            const rawTx = {
                nonce: web3.utils.toHex(nonce),
                gasPrice: web3.utils.toHex(gasprice),
                gasLimit: web3.utils.toHex(this.gaslimit),
                to: process.env.SCADDRESS,
                value: '0x00',
                data: this.data,
            }

            let tx = new Transaction(rawTx)
            tx.sign(this.private)
            let serializedTx = tx.serialize()

            web3.eth
                .sendSignedTransaction('0x' + serializedTx.toString('hex'))
                .on('transactionHash', tx => {
                    this.transactionHash = tx
                    resolve(this)
                })
                .on('error', error => {
                    throw Error(error)
                })
        })
    }

}
module.exports = Blockchain
