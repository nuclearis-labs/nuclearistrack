const Document = require('../models/document');

function queryRole(role, cc, username) {
	switch (role) {
		case 'prov':
			if (cc && cc !== 'all') return { $and: [ { proyecto: cc }, { visible: true }, { username: username } ] };
			else if (cc == 'all') return { $and: [ { visible: true }, { username: username } ] };
			else return { $and: [ { visible: true }, { username: username } ] };
			break;
		case 'client':
			if (cc && cc !== 'all') return { $and: [ { proyecto: cc }, { visible: true } ] };
			else if (cc == 'all') return { visible: true };
			else return { visible: true };
			break;
		case 'nrs':
			if (cc && cc !== 'all') return { $and: [ { proyecto: cc }, { visible: true } ] };
			else if (cc == 'all') return { visible: true };
			else return { visible: true };
			break;
	}
}

function renderlist(req, res, query, perpage, page) {
	Document.countDocuments({}, (err, countDoc) => {
		if (err) {
			res.render('partials/error', { error: err });
		}
		Document.find(query, (err, doc) => {
			if (err) {
				throw new Error(err);
			} else {
				res.render('list', { list: doc, countDoc: countDoc, perpage: perpage, page: page });
			}
		})
			.skip(req.query.page > 0 ? (req.query.page - 1) * perpage : 0)
			.limit(perpage)
			.sort('-proyecto');
	});
}

function getPage(page) {
	if (page == undefined) {
		return 1;
	} else {
		return page;
	}
}

module.exports = { queryRole, renderlist, getPage };
