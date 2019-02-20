// Require packages
var express = require('express'),
	fs = require('fs'),
	crypto = require('crypto'),
	Web3 = require('web3'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	passportLocalMongoose = require('passport-local-mongoose'),
	multer = require('multer'),
	mongoose = require('mongoose'),
	Document = require('./models/document'),
	User = require('./models/user'),
	ethereumjs = require('ethereumjs-tx'),
	ExpressBrute = require('express-brute'),
	MongooseStore = require('express-brute-mongoose');

var app = express();

app.use(
	require('express-session')({
		secret: 'oomph quant brake linseed vitrics deicide abandon piping playboy yataghan',
		resave: false,
		saveUninitialized: false,
		cookie: { secure: false }
	})
);

var upload = multer({ dest: 'uploads/' });

var pwd = encodeURI('XhD*,CWng9=*s>,8wXvX');

// Require and connect to mongoose database
mongoose.connect(
	'mongodb://smartinez:' +
		pwd +
		'@nrsblockchain-shard-00-00-kzg9l.mongodb.net:27017,nrsblockchain-shard-00-01-kzg9l.mongodb.net:27017,nrsblockchain-shard-00-02-kzg9l.mongodb.net:27017/test?ssl=true&replicaSet=NRSBlockchain-shard-0&authSource=admin&retryWrites=true',
	{
		useNewUrlParser: true
	}
);
mongoose.set('useCreateIndex', true);

const BruteForceSchema = require('express-brute-mongoose/dist/schema');
const model = mongoose.model('bruteforce', new mongoose.Schema(BruteForceSchema));
const store = new MongooseStore(model);

var bruteforce = new ExpressBrute(store);

var contract = undefined;
var account = '0x307EAa91FA219463Ac521f9A549dBDc7fF82C06c';
var address = '0xD0de256c1C531b77D66e86C0E39E87dee6572195';
var privkey = new Buffer.from('7a0824e86e5c362c523d7f4991de30b56a9c04f653c33573b0a1e3b8850b23c6', 'hex');

const web3 = new Web3(Web3.givenProvider || 'https://public-node.testnet.rsk.co:443');

var jsonFile = 'build/contracts/MO.json';
var parsed = JSON.parse(fs.readFileSync(jsonFile));
var abi = parsed.abi;

contract = new web3.eth.Contract(abi, address);

//app.use(express.static('public'));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set('view engine', 'ejs');

//=======================
//FUNCTIONS
//=======================
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

function MO_send(hash, docid, user, callback) {
	let data = contract.methods.addDocHash(hash).encodeABI();
	let gasprice;
	let gaslimit;
	estimateGasLimit(account, hash)
		.then((result) => {
			gaslimit = result;
			gaslimit += 1000;
			console.log(gaslimit);
		})
		.catch((error) => console.log(error));
	estimateGasPrice()
		.then((result) => {
			gasprice = result;
			console.log(gasprice);
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
				Document.create({ id: docid, hash: hash, tx: tx, mined: false, username: user }, function(err, doc) {
					if (err) {
						console.log('Error: ' + err);
					}
					console.log(doc);
					callback(null, tx);
				});
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

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

//=======================
//ROUTES
//=======================

app.get('/', function(req, res) {
	if (req.isAuthenticated()) {
		res.render('home_logged', { username: req.session.user });
	} else {
		res.render('home');
	}
});

app.get('/hash', isLoggedIn, function(req, res) {
	res.render('hash_logged', { username: req.session.user });
});

app.get('/list', isLoggedIn, function(req, res) {
	var list = undefined;
	Document.find({ username: req.session.user }, function(err, doc) {
		if (err) {
			console.log('Something went wrong');
		} else {
			res.render('list_logged', { list: doc, username: req.session.user });
		}
	});
});

app.get('/signup', function(req, res) {
	res.render('signup');
});

app.get('/login', function(req, res) {
	res.render('login');
});

app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

app.post('/login', bruteforce.prevent, upload.none(), function(req, res, next) {
	passport.authenticate('local', function(err, user) {
		if (!user) {
			return res.redirect('/login');
		}
		if (err) {
			console.log(err);
		}
		req.logIn(user, function(err) {
			if (err) {
				return next(err);
			}
		});
		req.session.user = user.username;
		return res.render('home_logged', {
			username: req.session.user
		});
	})(req, res, next);
});

app.post('/signup', bruteforce.prevent, upload.none(), function(req, res) {
	User.register(new User({ username: req.body.username }), req.body.password, function(err, user) {
		if (err) {
			console.log(err);
			return res.render('signup');
		}
		passport.authenticate('local')(req, res, function() {
			req.session.user = req.body.username;
			res.render('home_logged', { username: req.session.user });
		});
	});
});

app.post('/hash', upload.single('newhash'), function(req, res, next) {
	var docid = req.body.id;
	// creates a read stream of the uploaded file through multer
	var fd = fs.createReadStream(req.file.path);

	var hash = crypto.createHash('sha256');

	// Defines the encoding as Hex
	hash.setEncoding('hex');

	fd.once('end', function() {
		// When the Read Stream ends, end the hash object and read the obtained hash
		hash.end();
		var hashed = hash.read();
		hashed = '0x' + hashed;

		fs.unlink(req.file.path, (err) => {
			if (err) throw err;
			console.log(req.file.path + ' was deleted');
		});

		MO_find(hashed, function(error, resultObj) {
			if (resultObj.blockNumber != 0) {
				Document.findOne({ hash: hashed }, function(err, doc) {
					if (err) {
						console.log('Got: ' + err);
					} else {
						console.log(doc);
						res.render('partials/check_duplicate', {
							hashed: hashed,
							result: resultObj,
							doc: doc,
							username: req.session.user
						});
					}
				});
			} else {
				//Call MO_send function with the hex hash and await the result for rendering the hash page
				MO_send(hashed, docid, req.session.user, function(error, result) {
					if (result) {
						res.render('partials/hash', {
							hashed: hashed,
							docid: docid,
							result: result,
							username: req.session.user
						});
					}
				});
			}
		});
	});

	// read all file and pipe it (write it) to the hash object
	fd.pipe(hash);

	// Once obtained the hash, delete the file from the server and console.log the deletion.
});

app.post('/check', upload.single('newhash'), function(req, res, next) {
	console.log('File uploaded');
	// creates a read stream of the uploaded file through multer
	var fd = fs.createReadStream(req.file.path);
	// initiates the sha256 object
	var hash = crypto.createHash('sha256');
	// Defines the encoding as Hex
	hash.setEncoding('hex');

	fd.once('end', function() {
		// When the Read Stream ends, end the hash object and read the obtained hash
		hash.end();
		var hashed = hash.read();
		hashed = '0x' + hashed;

		fs.unlink(req.file.path, (err) => {
			if (err) throw err;
			console.log(req.file.path + ' was deleted');
		});

		//Call MO_find function with the hex hash and await the result for rendering the check hash page
		MO_find(hashed, function(error, resultObj) {
			if (resultObj.blockNumber != 0) {
				Document.findOne({ hash: hashed }, function(err, doc) {
					if (err) {
						console.log('Got: ' + err);
					} else {
						res.render('partials/check', {
							hashed: hashed,
							result: resultObj,
							doc: doc,
							username: req.session.user
						});
					}
				});
			} else {
				res.render('partials/check_notfound', { hashed: hashed, username: req.session.user });
			}
		});
	});

	// read all file and pipe it (write it) to the hash object
	fd.pipe(hash);

	// Once obtained the hash, delete the file from the server and console.log the deletion.
});

app.get('*', function(req, res) {
	res.render('lost');
});

app.listen(3000, 'localhost', function() {
	console.log('Server working');
});
