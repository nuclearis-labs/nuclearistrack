var express = require('express');
var app = express();

const Web3 = require('web3');

var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

const fs = require('fs');
const crypto = require('crypto');

var contract = undefined;
var address = '0x7af24F98a3Ad5c651eA7925482dE8e0f910c965f';
var abi = undefined;

var hashed = undefined;
// if (typeof web3 !== 'undefined') {
// } else {
// console.log('No Ethereum interface injected into browser. Read-only access');
// }
const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

app.use(express.static('public'));
app.set('view engine', 'ejs');

function mo_init() {
	// Chequear si el objeto web3 fue definido en caso contrario definir web3 desde un HttpProvider
	var ether = undefined;
	var jsonFile = 'build/contracts/MO.json';
	var parsed = JSON.parse(fs.readFileSync(jsonFile));
	var abi = parsed.abi;

	contract = new web3.eth.Contract(abi, address);
	//Funciona o no funciona dependiendo si tiene que desbloquear una cuenta o no..
	//web3.eth.personal.unlockAccount(account,privatekey,100).then(function(log){console.log("Account unlocked")});
	web3.eth.getAccounts(function(error, accounts) {
		web3.eth.getBalance(accounts[0]).then(function(ether) {});
		ether = ether;
	});
	return ether;
}

mo_init();

function MO_send(hash, callback) {
	web3.eth.getAccounts(function(error, accounts) {
		contract.methods
			.addDocHash(hash)
			.send({ from: accounts[0] })
			.on('transactionHash', (tx) => {})
			.on('receipt', (receipt) => {
				callback(null, receipt);
			})
			.on('confirmation', (confirmationNumber, receipt) => {})
			.on('error', console.error);
	});
}

//looks up a hash on the blockchain
function MO_find(hash, callback) {
	web3.eth.getAccounts(function(error, accounts) {
		contract.methods.findDocHash(hash).call({ from: accounts[0] }).then((result) => {
			let resultObj = {
				mineTime: new Date(result[0] * 1000),
				blockNumber: result[1]
			};
			callback(null, resultObj);
		});
	});
}

app.get('/', function(req, res) {
	res.render('home');
});

app.post('/hash', upload.single('newhash'), function(req, res, next) {
	console.log('File uploaded');
	// creates a read stream of the uploaded file through multer
	var fd = fs.createReadStream(req.file.path);
	// initiates the sha256 object
	var hash = crypto.createHash('sha256');
	// Defines the encoding as Hex
	hash.setEncoding('hex');

	fd.on('end', function() {
		// When the Read Stream ends, end the hash object and read the obtained hash
		hash.end();
		var hashed = hash.read();

		console.log('0x' + hashed);

		//Call MO_send function with the hex hash and await the result for rendering the hash page
		MO_send('0x' + hashed, function(error, result) {
			if (result) {
				res.render('hash', { hashed: hashed, result: result });
			}
		});
	});

	// read all file and pipe it (write it) to the hash object
	fd.pipe(hash);

	// Once obtained the hash, delete the file from the server and console.log the deletion.
	fs.unlink(req.file.path, (err) => {
		if (err) throw err;
		console.log(req.file.path + ' was deleted');
	});
});

app.post('/check', upload.single('newhash'), function(req, res, next) {
	console.log('File uploaded');
	// creates a read stream of the uploaded file through multer
	var fd = fs.createReadStream(req.file.path);
	// initiates the sha256 object
	var hash = crypto.createHash('sha256');
	// Defines the encoding as Hex
	hash.setEncoding('hex');

	fd.on('end', function() {
		// When the Read Stream ends, end the hash object and read the obtained hash
		hash.end();
		var hashed = hash.read();

		console.log('0x' + hashed);

		//Call MO_find function with the hex hash and await the result for rendering the check hash page
		MO_find('0x' + hashed, function(error, resultObj) {
			if (resultObj.blockNumber != 0) {
				res.render('check', { hashed: hashed, result: resultObj });
			} else {
				console.log('No fue encontrado');
			}
		});
	});

	// read all file and pipe it (write it) to the hash object
	fd.pipe(hash);

	// Once obtained the hash, delete the file from the server and console.log the deletion.
	fs.unlink(req.file.path, (err) => {
		if (err) throw err;
		console.log(req.file.path + ' was deleted');
	});
});

app.listen(3000, 'localhost', function() {
	console.log('Server working');
});

// function visibility(param) {
// 	switch (param) {
// 		case 'loading':
// 			document.getElementById('loader').style = 'display: block';
// 			document.getElementById('hashFile').setAttribute('disabled', '');
// 			document.getElementById('sendHashButton').setAttribute('disabled', '');
// 			document.getElementById('findHashButton').setAttribute('disabled', '');
// 			break;
// 		case 'done':
// 			document.getElementById('hashFile').removeAttribute('disabled', '');
// 			document.getElementById('sendHashButton').removeAttribute('disabled', '');
// 			document.getElementById('findHashButton').removeAttribute('disabled', '');
// 			document.getElementById('loader').style = 'display: none';
// 			break;
// 	}
// }

// function send() {
// 		MO_find(hash, function(err, resultObj) {
// 			if (resultObj.blockNumber != 0) {
// 				visibility('done');
// 				$('#responseText').html(
// 					"<div class='alert alert-warning' role='alert'><p><b>Hash de archivo ya fue guardado en la Blockchain.</b></p>" +
// 						'<p><b>Hash del archivo: </b><br/>' +
// 						hash +
// 						'</p>' +
// 						'<p><b>Nº de bloque minado: </b><br/>' +
// 						resultObj.blockNumber +
// 						'</p>' +
// 						'<p><b>Fecha y hora de bloque minado: </b><br/>' +
// 						resultObj.mineTime +
// 						'</p></div>'
// 				);
// 			} else {
// 				MO_send(hash, function(err, receipt) {
// 					visibility('done');

// 					let url = 'https://api.coinmarketcap.com/v1/ticker/ethereum/';
// 					fetch(url)
// 						.then(function(response) {
// 							return response.json();
// 						})
// 						.then(function(data) {
// 							let eth1 = JSON.stringify(data[0]);
// 							let eth2 = JSON.parse(eth1);
// 							$('#responseText').html(
// 								"<div class='alert alert-info' role='alert'><p><b>Hash de archivo fue guardado en la Blockchain.</b></p>" +
// 									'<p><b>Hash del archivo:</b><br/> ' +
// 									hash +
// 									'</p>' +
// 									'<p><b>Identificación de transacción:</b><br/> ' +
// 									receipt.transactionHash +
// 									'</p>' +
// 									'<p><b>Costo de la transacción:</b><br/>' +
// 									receipt.gasUsed * 20000000000 / 10 ** 18 +
// 									' ETH / ' +
// 									Math.round(receipt.gasUsed * 20000000000 / 10 ** 18 * eth2.price_usd * 100) / 100 +
// 									' USD</p>' +
// 									'<p><b>Dirección del contrato:</b><br/> ' +
// 									receipt.to +
// 									'</p>' +
// 									'<p><b>Numero de bloque minado:</b><br/> ' +
// 									receipt.blockNumber +
// 									'</p>'
// 							);
// 						});
// 				});
// 			}
// 		});
// 	});
// }

// function find() {
// 	hashForFile(function(err, hash) {
// 		MO_find(hash, function(err, resultObj) {
// 			if (resultObj.blockNumber != 0) {
// 				$('#responseText').html(
// 					"<div class='alert alert-success' role='alert'><p><b>Hash de archivo encontrado en la Blockchain.</b></p>" +
// 						'<p><b>Hash del archivo: </b><br/>' +
// 						hash +
// 						'</p>' +
// 						'<p><b>Nº de bloque minado: </b><br/>' +
// 						resultObj.blockNumber +
// 						'</p>' +
// 						'<p><b>Fecha y hora de bloque minado: </b><br/>' +
// 						resultObj.mineTime +
// 						'</p></div>'
// 				);
// 			} else {
// 				$('#responseText').html(
// 					"<div class='alert alert-warning' role='alert'><p><b>Hash de archivo no encontrado en la Blockchain.</b></p>" +
// 						'<p><b>Hash del archivo: </b><br/>' +
// 						hash +
// 						'</p></div>'
// 				);
// 			}
// 		});
// 	});
// }
