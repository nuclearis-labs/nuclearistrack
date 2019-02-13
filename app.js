// Require and define expressjs
var express = require('express');
var app = express();

// Require web3
const Web3 = require('web3');

// Require and define multer middleware
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

// Require fs and crypto and defines SHA256 method
const fs = require('fs');
const crypto = require('crypto');
var hash = crypto.createHash('sha256');

// Require and connect to mongoose database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mo_nrs');

var docSchema = new mongoose.Schema({
	id: String,
	hash: String,
	tx: String,
	mined: Boolean
});

var Document = mongoose.model('Document', docSchema);

var contract = undefined;
var address = '0x79fD21c186f60d6425834a002Ca44377A568E229';

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
			.on('transactionHash', (tx) => {
				Document.create({ id: 'Test', hash: hash, tx: tx, mined: false }, function(err, doc) {
					if (err) {
						console.log('Something went wrong');
					} else {
						console.log(tx);
						console.log(doc);
					}
				});
				callback(null, tx);
			})
			.on('receipt', (receipt) => {})
			.on('confirmation', (confirmationNumber, receipt) => {
				if (confirmationNumber > 20) {
					Document.update({ tx: receipt.transactionHash }, { $set: { mined: true } }, function(err, doc) {
						if (err) {
							console.log('Something went wrong');
						} else {
							console.log(receipt);
							console.log(doc);
							console.log(confirmationNumber);
						}
					});
				}
			})
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
	// Defines the encoding as Hex
	hash.setEncoding('hex');

	fd.on('end', function() {
		// When the Read Stream ends, end the hash object and read the obtained hash
		hash.end();
		var hashed = hash.read();

		console.log('0x' + hashed);

		MO_find('0x' + hashed, function(error, resultObj) {
			if (resultObj.blockNumber != 0) {
				res.render('check_duplicate', { hashed: hashed, result: resultObj });
			} else {
				//Call MO_send function with the hex hash and await the result for rendering the hash page
				MO_send('0x' + hashed, function(error, result) {
					if (result) {
						res.render('hash', { hashed: hashed, result: result });
					}
				});
			}
		});
	});

	// read all file and pipe it (write it) to the hash object
	fd.pipe(hash);

	// Once obtained the hash, delete the file from the server and console.log the deletion.
	// fs.unlink(req.file.path, (err) => {
	// 	if (err) throw err;
	// 	console.log(req.file.path + ' was deleted');
	// });
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
				res.render('check_notfound', { hashed: hashed });
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

app.get('*', function(req, res) {
	res.render('lost');
});

app.listen(3000, 'localhost', function() {
	console.log('Server working');
});
