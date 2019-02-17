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
	User = require('./models/user');

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

// Require and connect to mongoose database
mongoose.connect('mongodb://localhost/mo_nrs', { useNewUrlParser: true });

var contract = undefined;
var address = '0xc4a0C8E1Cf512a931E4d8fAA8a6FC014864b9f3e';

const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

app.use(express.static('public'));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set('view engine', 'ejs');

//=======================
//FUNCTIONS
//=======================

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

function MO_send(hash, docid, user, callback) {
	web3.eth.getAccounts(function(error, accounts) {
		contract.methods
			.addDocHash(hash)
			.send({ from: accounts[0] })
			.on('transactionHash', (tx) => {
				Document.create({ id: docid, hash: hash, tx: tx, mined: false,username: user }, function(err, doc) {
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
	Document.find({username:req.session.user}, function(err, doc) {
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

app.post('/login', upload.none(), function(req, res, next) {
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

app.post('/signup', upload.none(), function(req, res) {
	User.register(new User({ username: req.body.username }), req.body.password, function(err, user) {
		if (err) {
			console.log(err);
			return res.render('signup');
		}
		passport.authenticate('local')(req, res, function() {
			req.session.user = req.body.username;
			res.render('home_logged',{username:req.session.user});
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

	fd.on('data', (chunk) => {
		console.log(`Received ${chunk.length} bytes of data.`);
	});

	fd.once('end', function() {
		// When the Read Stream ends, end the hash object and read the obtained hash
		hash.end();
		var hashed = hash.read();

		console.log('0x' + hashed);

		MO_find('0x' + hashed, function(error, resultObj) {
			if (resultObj.blockNumber != 0) {
				res.render('partials/check_duplicate', { hashed: hashed, docid: docid, result: resultObj, username:req.session.user});
			} else {
				//Call MO_send function with the hex hash and await the result for rendering the hash page
				MO_send('0x' + hashed, docid, req.session.user, function(error, result) {
					if (result) {
						res.render('partials/hash', { hashed: hashed, docid: docid, result: result,username:req.session.user});
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

	fd.on('data', (chunk) => {
		console.log(`Received ${chunk.length} bytes of data.`);
	});

	fd.once('end', function() {
		// When the Read Stream ends, end the hash object and read the obtained hash
		hash.end();
		var hashed = hash.read();

		console.log('0x' + hashed);

		//Call MO_find function with the hex hash and await the result for rendering the check hash page
		MO_find('0x' + hashed, function(error, resultObj) {
			if (resultObj.blockNumber != 0) {
				res.render('partials/check', { hashed: hashed, result: resultObj,username:req.session.user });
			} else {
				res.render('partials/check_notfound', { hashed: hashed,username:req.session.user });
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

app.get('*', function(req, res) {
	res.render('lost');
});

app.listen(3000, 'localhost', function() {
	console.log('Server working');
});
