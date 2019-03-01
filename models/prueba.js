const Web3 = require('web3'),
	fs = require('fs'),
	ethereumjs = require('ethereumjs-tx');

//Declare Truffle Ganache Variables for test purposes and env variables for RSK.
const account = '0x307EAa91FA219463Ac521f9A549dBDc7fF82C06c';
const address = '0x567B01fafc8637257F6F964d88D2d931d74543d7';
const privkey = new Buffer.from('7a0824e86e5c362c523d7f4991de30b56a9c04f653c33573b0a1e3b8850b23c6', 'hex');

const web3 = new Web3(Web3.givenProvider || 'https://public-node.testnet.rsk.co:443');

const jsonFile = 'MO.json';
const parsed = JSON.parse(fs.readFileSync(jsonFile));
const abi = parsed.abi;

const hash = '0x99781645be643600751d5d1e3abf0b6a947fa92b5191e89cfd9cb5e91e158f4e';

const contract = new web3.eth.Contract(abi, address);

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

function send(hash, callback) {
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
		if (err) {
			console.log(err);
		}
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
				callback(null, tx);
			})
			.on('receipt', (receipt) => {
				console.log(receipt);
			})
			.catch((error) => {
				console.log(error);
			});
	});
}

send(hash, function(err, result) {
	if (err) {
		console.log(err);
	}
	if (result) {
		console.log(result);
	}
});
