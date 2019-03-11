const express = require('express'),
	router = express.Router({ mergeParams: true }),
	Document = require('../models/document'),
	web3Hash = require('../functions/web3Hash'),
	web3Send = require('../functions/web3Send'),
	list = require('../functions/list'),
	web3Check = require('../functions/web3Check'),
	hash = require('../functions/hash'),
	middleware = require('../middleware/index');

router.get('/hash', middleware.isLoggedIn, (req, res) => {
	res.render('hash');
});

router.get('/list/', middleware.isLoggedIn, (req, res) => {
	let perpage = 10;
	let page = list.getPage(req.query.page);

	let query = list.queryRole(req.user.role, req.query.cc, req.user.username);

	list.renderlist(req, res, query, perpage, page);
});

router.post(
	'/hash',
	middleware.isLoggedIn,
	middleware.asyncMiddleware(async (req, res, next) => {
		let hashObj = await web3Send.hashandupload(req);

		if (hashObj.resultObj.blockNumber != 0) {
			web3Send.blockfound(req, res, hashObj.hashed, hashObj.resultObj);
		} else {
			web3Send.blocknotfound(req, res, hashObj.hashed, hashObj.resultObj, hashObj.fileName);
		}
	})
);

router.post(
	'/check',
	middleware.isLoggedIn,
	middleware.asyncMiddleware(async (req, res, next) => {
		await hash.bus(req);

		let hashed = await hash.create(req.files.newhash);

		let resultObj = await web3Hash.find(hashed, web3Hash.account);
		if (resultObj.blockNumber != 0) {
			web3Check.checkfound(req, res, resultObj);
		} else {
			web3Check.checknotfound(req, res, hashed);
		}
	})
);

router.get(
	'/check',
	middleware.isLoggedIn,
	middleware.asyncMiddleware(async (req, res, next) => {
		let resultObj = await web3Hash.find(req.query.hash, web3Hash.account);

		if (resultObj.blockNumber != 0) {
			web3Check.checkfound(req, res, resultObj);
		} else {
			web3Check.checknotfound(req, res, req.query.hash);
		}
	})
);

router.get('/delete', middleware.isLoggedIn, (req, res, next) => {
	Document.updateOne({ hash: req.query.hash }, { $set: { visible: false } }, (err, doc) => {
		if (err) {
			throw new Error(err);
		} else {
			res.render('partials/delete', {
				hashed: req.query.hash,
				doc: doc
			});
		}
	});
});

module.exports = router;
