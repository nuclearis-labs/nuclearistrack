const AWS = require('aws-sdk'),
	crypto = require('crypto'),
	Busboy = require('busboy');

// creates a read stream of the uploaded file through multer
async function create(file) {
	return new Promise(async (resolve, reject) => {
		let hash_prom = crypto.createHash('sha256');

		hash_prom.update(file.data);

		let hashed = hash_prom.digest('hex');

		hashed = '0x' + hashed;
		resolve(hashed);
	});
}

function uploadToS3(file, user, body, fileName) {
	return new Promise((reject, resolve) => {
		let s3bucket = new AWS.S3({
			accessKeyId: process.env.IAM_USER_KEY || 'AKIAJ3TFNND5CHVIMOLA',
			secretAccessKey: process.env.IAM_USER_SECRET || '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',
			Bucket: process.env.BUCKET_NAME || 'nrs-blockchain'
		});
		s3bucket.createBucket(function() {
			var params = {
				Bucket: process.env.BUCKET_NAME || 'nrs-blockchain',
				Key: fileName,
				Body: file.data
			};
			s3bucket.upload(params, function(err, data) {
				if (err) reject(err);
				resolve(data);
			});
		});
	});
}

function bus(req) {
	return new Promise((resolve, reject) => {
		var busboy = new Busboy({ headers: req.headers });
		busboy.on('finish', function() {
			resolve();
		});

		req.pipe(busboy);
	});
}

module.exports = { create, bus, uploadToS3 };
