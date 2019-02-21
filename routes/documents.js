const express = require('express'),
	router = express.Router(),
	Document = require('../models/document'),
	multer = require('multer'),
	fs = require('fs'),
	upload = multer({ dest: 'uploads/' }),
	web3functions = require('../models/web3'),
	MO_find = web3functions.MO_find,
	MO_send = web3functions.MO_send,
	crypto = require('crypto');

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

router.get('/hash', isLoggedIn, function(req, res) {
	res.render('hash', { username: req.session.user });
});

router.get('/list', isLoggedIn, function(req, res) {
	var list = undefined;

	Document.find({ username: req.user.username }, function(err, doc) {
		if (err) {
			console.log('Something went wrong');
		} else {
			res.render('list', { list: doc, username: req.session.user });
		}
	});
});

router.post('/hash', isLoggedIn, upload.single('newhash'), function(req, res, next) {
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
							doc: doc
						});
					}
				});
			} else {
				//Call MO_send function with the hex hash and await the result for rendering the hash page
				MO_send(hashed, docid, req.user.username, function(error, result) {
					if (result) {
						res.render('partials/hash', {
							hashed: hashed,
							docid: docid,
							result: result
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

router.post('/check', isLoggedIn, upload.single('newhash'), function(req, res, next) {
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
							doc: doc
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

module.exports = router;
