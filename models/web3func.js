const Web3 = require('web3'),
	fs = require('fs'),
	Document = require('./document'),
	ethereumjs = require('ethereumjs-tx');

//Declare Truffle Ganache Variables for test purposes and env variables for RSK.
var contract = undefined;
var account = '0x211d5c2fb17ee2b9c412aec36f4a4ca274bb131f' || process.env.RSKadress;
var address = '' || process.env.SCadress;
var privkey = new Buffer.from(
	'c90cd5b4d4505251df8f9af943708ced3ec9d1a9cd79dfe29219830c49682b97' || process.env.RSKprivkey,
	'hex'
);
//https://public-node.testnet.rsk.co:443
const web3 = new Web3(Web3.givenProvider || 'https://public-node.testnet.rsk.co:443');

var jsonFile = 'build/contracts/MO.json';
var parsed = JSON.parse(fs.readFileSync(jsonFile));
var abi = parsed.abi;

contract = new web3.eth.Contract(abi, address);

function estimateGasLimit(account, hash) {
	return new Promise((resolve, reject) => {
		contract.methods.addDocHash(hash).estimateGas({ from: account }, function(err, result) {
			if (err) {
				reject(new Error('Error: ' + err));
			} else {
				resolve(result);
			}
		});
	});
}

function estimateGasPrice() {
	return new Promise((resolve, reject) => {
		web3.eth.getGasPrice(function(err, result) {
			if (err) {
				reject(new Error('Error: ' + err));
			} else {
				resolve(result);
			}
		});
	});
}

function MO_send(hash, docid, filename, cc, user, callback) {
	let data = contract.methods.addDocHash(hash).encodeABI();
	let gasprice;
	let gaslimit;
	estimateGasLimit(account, hash)
		.then((result) => {
			gaslimit = result;
		})
		.catch((error) => console.log(error));

	estimateGasPrice()
		.then((result) => {
			gasprice = result;
		})
		.catch((error) => {
			console.log(error);
		});

	web3.eth.getTransactionCount(account, function(err, nonce) {
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
						id: docid,
						hash: hash,
						tx: tx,
						filename: filename,
						proyecto: cc,
						mined: false,
						visible: true,
						username: user
					},
					function(err, doc) {
						if (err) {
							console.log('Error: ' + err);
						}
						console.log(doc);
						callback(null, tx);
					}
				);
			})
			.on('receipt', (receipt) => {
				Document.updateOne({ tx: receipt.transactionHash }, { $set: { mined: true } }, function(err, doc) {
					if (err) console.log(err);
					console.log(receipt);
					console.log(doc);
				});
			})
			.catch((error) => {
				console.log(error);
			});
	});
}

//looks up a hash on the blockchain
function MO_find(hash, callback) {
	contract.methods.findDocHash(hash).call({ from: account }).then((result) => {
		let resultObj = {
			mineTime: new Date(result[0] * 1000),
			blockNumber: result[1]
		};
		callback(null, resultObj);
	});
}

module.exports = { MO_find, MO_send };
