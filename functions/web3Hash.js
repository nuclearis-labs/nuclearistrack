const Web3 = require('web3'),
	fs = require('fs'),
	Document = require('../models/document'),
	ethereumjs = require('ethereumjs-tx');

//Declare Truffle Ganache Variables for test purposes and env variables for RSK.
var contract = undefined;
var account = process.env.RSKadress;
var address = process.env.SCadress;
var privkey = new Buffer.from(process.env.RSKprivkey, 'hex');
//https://public-node.testnet.rsk.co:443
const web3 = new Web3(Web3.givenProvider || 'https://public-node.rsk.co:443');

var jsonFile = 'build/contracts/MO.json';
var parsed = JSON.parse(fs.readFileSync(jsonFile));
var abi = parsed.abi;

contract = new web3.eth.Contract(abi, address);

async function estimateGasLimit(account, hash) {
	return new Promise((resolve, reject) => {
		contract.methods
			.addDocHash(hash)
			.estimateGas({ from: account })
			.then((result) => resolve(result))
			.catch(function(e) {
				reject(e);
			});
	});
}

async function estimateGasPrice() {
	return new Promise((resolve, reject) => {
		web3.eth.getGasPrice().then((result) => resolve(result)).catch((e) => {
			reject(e);
		});
	});
}

async function send(hash, body, filename, user, gasprice, gaslimit) {
	return new Promise((resolve, reject) => {
		let data = contract.methods.addDocHash(hash).encodeABI();

		web3.eth.getTransactionCount(account, (err, nonce) => {
			if (err) reject(err);
			const rawTx = {
				nonce: web3.utils.toHex(nonce),
				gasPrice: web3.utils.toHex(gasprice),
				gasLimit: web3.utils.toHex(gaslimit),
				to: address,
				value: '0x00',
				data: data
			};

			const ethtx = new ethereumjs(rawTx);
			ethtx.sign(privkey);
			const serializedTx = ethtx.serialize();
			web3.eth
				.sendSignedTransaction('0x' + serializedTx.toString('hex'))
				.on('transactionHash', (tx) => {
					Document.create(
						{
							id: body.id,
							hash: hash,
							tx: tx,
							filename: filename,
							proyecto: body.cc,
							mined: false,
							visible: true,
							username: user
						},
						(err, doc) => {
							if (err) console.log(err);
							console.log(doc);
							resolve(tx);
						}
					);
				})
				.on('receipt', (receipt) => {
					Document.updateOne({ tx: receipt.transactionHash }, { $set: { mined: true } }, (err, doc) => {
						console.log(doc);
					});
				})
				.on('error', (error) => {
					console.error(error);
				});
		});
	});
}

//looks up a hash on the blockchain
async function find(hash, account) {
	let result = await contract.methods.findDocHash(hash).call({ from: account });
	let resultObj = {
		mineTime: new Date(result[0] * 1000),
		blockNumber: result[1]
	};
	return resultObj;
}

module.exports = { find, send, estimateGasPrice, estimateGasLimit, account };
