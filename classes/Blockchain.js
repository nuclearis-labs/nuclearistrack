const Web3 = require("web3"),
    fs = require("fs"),
    documentModel = require("../models/document"),
    { createHash } = require("crypto"),
    Transaction = require("ethereumjs-tx");

// ***************************** DECLARAR VARIABLES *********************************
const walletaddress = process.env.RSKadress || "0xbA8692699d88831563E2fE10E04489919C42e4b0",
    SCaddress = process.env.SCadress || "0x0A464b1319Ba83aF0AA39ba42Cf766154E24845e",
    privateKey = new Buffer.from(
        process.env.RSKprivkey ||
        '725cff30fe95d94f5497487bfdfe6fc8c640ce57e99ad9a7ecbe73b62441fb20',
        'hex'
    )

// ***************************** ARMAR ENVIROMENT *********************************

const web3 = new Web3(process.env.blockchain || "http://127.0.0.1:7545"),
    jsonFile = "build/contracts/NuclearPoE.json",
    parsed = JSON.parse(fs.readFileSync(jsonFile)),
    abi = parsed.abi,
    contract = new web3.eth.Contract(abi, SCaddress)
/**
 * @name Blockchain
 * @desc Parent Class of Documento with Blockchain functions
 * @namespace
 * @constructor
 */
class Blockchain {
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
            .call({ from: walletaddress })
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
    async addDocHash() {
        this.data = contract.methods.addDocHash(this.fileHash).encodeABI()
        this.gaslimit = await contract.methods
            .addDocHash(this.fileHash)
            .estimateGas({ from: walletaddress })
        return this
    }

    checkForInputType(input, type) {
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
            .estimateGas({ from: walletaddress })
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
            .estimateGas({ from: walletaddress })
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
            let nonce = await web3.eth.getTransactionCount(walletaddress)

            const rawTx = {
                nonce: web3.utils.toHex(nonce),
                gasPrice: web3.utils.toHex(gasprice),
                gasLimit: web3.utils.toHex(this.gaslimit),
                to: SCaddress,
                value: '0x00',
                data: this.data,
            }

            let tx = new Transaction(rawTx)
            tx.sign(privateKey)
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
