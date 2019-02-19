const express = require('express'),
	router = express.Router({ mergeParams: true }),
	Document = require('../models/document'),
	multer = require('multer'),
	web3Hash = require('../models/web3Hash'),
	hash = require('../models/hash'),
	middleware = require('../middleware/index');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/');
	},
	filename: (req, file, cb) => {
		let ext = file.originalname.slice(-3);
		cb(null, req.user.username + '-' + '2320' + '-' + Date.now() + '.' + ext);
	}
});

const upload = multer({ storage: storage });

router.get('/hash', (req, res) => {
	res.render('hash');
});

router.get('/list/', middleware.isLoggedIn, (req, res) => {
	let perpage = 10;
	let page;
	if (req.query.cc && req.query.cc !== 'all') query = { $and: [ { proyecto: req.query.cc }, { visible: true } ] };
	else if (req.query.cc == 'all') query = { visible: true };
	else query = { visible: true };

	if (req.query.page == undefined) {
		page = 1;
	} else {
		page = req.query.page;
	}

	Document.countDocuments({}, (err, countDoc) => {
		if (err) {
			res.render('partials/error', { error: err });
		}
		Document.find(query, (err, doc) => {
			if (err) {
				console.log(err);
			} else {
				res.render('list', { list: doc, countDoc: countDoc, perpage: perpage, page: page });
			}
		})
			.skip(req.query.page > 0 ? (req.query.page - 1) * perpage : 0)
			.limit(perpage)
			.sort('-proyecto');
	});
});

router.post(
	'/hash',
	middleware.isLoggedIn,
	upload.single('newhash'),
	middleware.asyncMiddleware(async (req, res, next) => {
		let hashed = await hash.create(req.file.path);
		let resultObj = await web3Hash.find(hashed, web3Hash.account);

		console.log(resultObj);

		if (resultObj.blockNumber != 0) {
			Document.findOne({ hash: hashed }, (err, doc) => {
				if (err) {
					throw new Error(err);
				} else if (doc && doc.visible === false) {
					Document.updateOne({ hash: hashed }, { $set: { visible: true } }, (err, update) => {
						if (err) {
							throw new Error(err);
						}
						res.render('partials/add_db', {
							doc: doc,
							hashed: hashed,
							result: resultObj
						});
					});
				} else if (doc && doc.visible === true) {
					console.log(doc);
					res.render('partials/check_duplicate', {
						hashed: hashed,
						result: resultObj,
						doc: doc
					});
				} else {
					res.render('partials/check_notfound', { hashed: hashed });
				}
			});
		} else {
			Document.findOne(
				{ hash: hashed },
				middleware.asyncMiddleware(async (err, doc) => {
					if (err) {
						throw new Error(err);
					}
					if (doc) {
						res.render('partials/check_notmined', {
							hashed: hashed,
							result: resultObj,
							doc: doc
						});
					} else {
						let gasprice = await web3Hash.estimateGasPrice();
						let gaslimit = await web3Hash.estimateGasLimit(web3Hash.account, hashed);
						let result = await web3Hash.send(
							hashed,
							req.body.id,
							req.file.filename,
							req.body.cc,
							req.user.username,
							gasprice,
							gaslimit
						);
						if (result) {
							res.render('partials/hash', {
								hashed: hashed,
								docid: req.body.id,
								result: result
							});
						}
					}
				})
			);
		}
	})
);

router.post(
	'/check',
	middleware.isLoggedIn,
	upload.single('newhash'),
	middleware.asyncMiddleware(async (req, res, next) => {
		let hashed = await hash.create(req.file.path);

		//Call findHash function with the hex hash and await the result for rendering the check hash page
		let resultObj = await web3Hash.find(hashed, web3Hash.account);
		console.log(resultObj);
		if (resultObj.blockNumber != 0) {
			Document.findOne({ hash: hashed }, (err, doc) => {
				if (err) {
					throw new Error(err);
				} else {
					res.render('partials/check', {
						hashed: hashed,
						result: resultObj,
						doc: doc
					});
				}
			});
		} else {
			Document.findOne({ hash: hashed }, (err, doc) => {
				if (err) {
					throw new Error(err);
				}
				if (doc) {
					res.render('partials/check_notmined', { hashed: hashed, doc: doc });
				} else {
					res.render('partials/check_notfound', { hashed: hashed });
				}
			});
		}
	})
);

router.get(
	'/check',
	middleware.isLoggedIn,
	middleware.asyncMiddleware(async (req, res, next) => {
		//Call findHash function with the hex hash and await the result for rendering the check hash page
		let resultObj = await web3Hash.find(req.query.hash, web3Hash.account);
		if (resultObj.blockNumber != 0) {
			Document.findOne({ hash: req.query.hash }, (err, doc) => {
				if (err) {
					console.log('Got: ' + err);
				} else {
					res.render('partials/check', {
						hashed: req.query.hash,
						result: resultObj,
						doc: doc
					});
				}
			});
		} else {
			Document.findOne({ hash: req.query.hash }, (err, doc) => {
				if (err) {
					console.log('Got: ' + err);
				}
				if (doc) {
					res.render('partials/check_notmined', { hashed: hashed, doc: doc });
				} else {
					res.render('partials/check_notfound', { hashed: hashed });
				}
			});
		}
	})
);

router.get('/delete', middleware.isLoggedIn, (req, res, next) => {
	Document.updateOne({ hash: req.query.hash }, { $set: { visible: false } }, (err, doc) => {
		if (err) {
			console.log('Got: ' + err);
		} else {
			res.render('partials/delete', {
				hashed: req.query.hash,
				doc: doc
			});
		}
	});
});

module.exports = router;
