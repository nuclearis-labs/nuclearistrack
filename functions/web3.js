const Web3 = require('web3'),
	fs = require('fs'),
	Document = require('../models/document'),
	ethereumjs = require('ethereumjs-tx');

// ***************************** DECLARAR VARIABLES *********************************
var contract = undefined;
var account = process.env.RSKadress || '0x307EAa91FA219463Ac521f9A549dBDc7fF82C06c';
var address = process.env.SCadress || '0xc5166C643C4c2E67345A2464535D88A9FD0CA32f';
var privkey = new Buffer.from(
	process.env.RSKprivkey || '7a0824e86e5c362c523d7f4991de30b56a9c04f653c33573b0a1e3b8850b23c6',
	'hex'
);
//https://public-node.testnet.rsk.co:443

// ***************************** ARMAR ENVIROMENT *********************************

const web3 = new Web3(Web3.givenProvider || process.env.blockchain || 'http://localhost:8545');

var jsonFile = 'build/contracts/MO.json';
var parsed = JSON.parse(fs.readFileSync(jsonFile));
var abi = parsed.abi;

contract = new web3.eth.Contract(abi, address);

// ***************************** ENVIAR HASH *********************************

async function send(hash) {
	return new Promise(async (resolve, reject) => {
		let serializedTx = await preparetx(hash);

		web3.eth
			.sendSignedTransaction('0x' + serializedTx.toString('hex'))
			.on('transactionHash', (tx) => {
				resolve(tx);
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
}

// ***************************** PREPARAR TRANSACCIÓN DE HASH *********************************

async function preparetx(hash) {
	let data = contract.methods.addDocHash(hash).encodeABI();

	let gasprice = await web3.eth.getGasPrice();
	let gaslimit = await contract.methods.addDocHash(hash).estimateGas({ from: account });

	let nonce = await web3.eth.getTransactionCount(account);

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
	return serializedTx;
}

// ***************************** BUSCAR HASH *********************************

async function find(hash) {
	let result = await contract.methods.findDocHash(hash).call({ from: account });
	let resultObj = {
		mineTime: new Date(result[0] * 1000),
		blockNumber: result[1]
	};
	return resultObj;
}

// ***************************** CHEQUEAR DB CONTRA HASH Y BLOCKCHAIN *********************************

async function check(resultObj, hashed) {
	let doc = await Document.findOne({ hash: hashed });
	if (resultObj.blockNumber !== '0') {
		console.log('El archivo es autentico', hashed);
		return {
			page: 'partials/check',
			data: {
				hashed: hashed,
				result: resultObj,
				doc: doc
			}
		};
	} else {
		if (doc) {
			console.log('No se mino todavia', hashed);

			return {
				page: 'partials/check_notmined',
				data: {
					hashed: hashed,
					doc: doc
				}
			};
		} else {
			console.log('No es autentico', hashed);

			return {
				page: 'partials/check_notfound',
				data: {
					hashed: hashed
				}
			};
		}
	}
}

// ***************************** BUSQUEDA DE BLOQUE *********************************

async function block(hashed, resultObj, id) {
	let doc = await Document.findOne({ hash: hashed });
	if (resultObj.blockNumber != 0) {
		if (doc && doc.visible === false) {
			let update = await Document.updateOne({ hash: hashed }, { $set: { visible: true } });
			console.log('Se volvio a agregar el archivo a la db', hashed);
			return {
				page: 'partials/add_db',
				data: {
					doc: doc,
					hashed: hashed,
					result: resultObj
				}
			};
		} else if (doc && doc.visible === true) {
			console.log('El archivo es un duplicado');
			return {
				page: 'partials/check_duplicate',
				data: {
					doc: doc,
					hashed: hashed,
					result: resultObj
				}
			};
		} else {
			console.log('No se encontro');
			return { page: 'partials/check_notfound', data: { hashed: hashed } };
		}
	} else {
		if (doc) {
			console.log('No se mino todavia');
			return {
				page: 'partials/check_notmined',
				data: {
					doc: doc,
					hashed: hashed,
					result: resultObj
				}
			};
		} else {
			let result = await send(hashed).catch((e) => console.error(e));
			console.log(result);
			if (result) {
				console.log('Se envió a la blockchain y se agrego en la DB');
				return {
					result: result,
					page: 'partials/hash',
					data: {
						hashed: hashed,
						docid: id,
						result: result
					}
				};
			}
		}
	}
}

module.exports = { send, find, check, block };
