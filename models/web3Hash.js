const Web3 = require('web3'),
	fs = require('fs'),
	Document = require('./document'),
	ethereumjs = require('ethereumjs-tx');

//Declare Truffle Ganache Variables for test purposes and env variables for RSK.
var contract = undefined;
var account = '0x307EAa91FA219463Ac521f9A549dBDc7fF82C06c' || process.env.RSKadress;
var address = '0x567B01fafc8637257F6F964d88D2d931d74543d7' || process.env.SCadress;
var privkey = new Buffer.from(
	'7a0824e86e5c362c523d7f4991de30b56a9c04f653c33573b0a1e3b8850b23c6' || process.env.RSKprivkey,
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

function send(hash, docid, filename, cc, user, callback) {
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
				if (error) {
					res.render('partials/error', { error: error });
				}
			});
	});
}

//looks up a hash on the blockchain
function find(hash, callback) {
	contract.methods.findDocHash(hash).call({ from: account }).then((result) => {
		let resultObj = {
			mineTime: new Date(result[0] * 1000),
			blockNumber: result[1]
		};
		callback(null, resultObj);
	});
}

module.exports = { find, send };
