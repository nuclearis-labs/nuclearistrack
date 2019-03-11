const Document = require('../models/document'),
	web3Hash = require('../functions/web3Hash'),
	hash = require('./hash');

async function hashandupload(req) {
	await hash.bus(req);
	let hashed = await hash.create(req.files.newhash);

	let ext = req.files.newhash.name.split('.');
	let fileName = req.user.username + '-' + req.body.cc + '-' + Date.now() + '.' + ext[ext.length - 1];
	let resultObj = await web3Hash.find(hashed, web3Hash.account);

	if ((resultObj.blockNumber = 0)) {
		await hash
			.uploadToS3(req.files.newhash, req.user.username, req.body, fileName)
			.then()
			.catch((error) => console.error(error));
	}
	return { hashed: hashed, fileName: fileName, resultObj: resultObj };
}

function blockfound(req, res, hashed, resultObj) {
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
			res.render('partials/check_duplicate', {
				hashed: hashed,
				result: resultObj,
				doc: doc
			});
		} else {
			res.render('partials/check_notfound', { hashed: hashed });
		}
	});
}

function blocknotfound(req, res, hashed, resultObj, fileName) {
	Document.findOne({ hash: hashed }, async (err, doc) => {
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
			let result = await web3Hash.send(hashed, req.body, fileName, req.user.username, gasprice, gaslimit);
			if (result) {
				res.render('partials/hash', {
					hashed: hashed,
					docid: req.body.id,
					result: result
				});
			}
		}
	});
}

module.exports = { blocknotfound, blockfound, hashandupload };
