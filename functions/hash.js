const AWS = require('aws-sdk'),
	crypto = require('crypto');

// creates a read stream of the uploaded file through multer
async function create(buffer) {
	return new Promise((resolve, reject) => {
		let hash_prom = crypto.createHash('sha256');

		hash_prom.update(buffer);

		let hashed = hash_prom.digest('hex');

		hashed = '0x' + hashed;
		console.log('Hash created: ', hashed);
		resolve(hashed);
	});
}

function uploadToS3(buffer, fileName) {
	return new Promise((resolve, reject) => {
		let s3bucket = new AWS.S3({
			accessKeyId: process.env.IAM_USER_KEY || 'AKIAJ3TFNND5CHVIMOLA',
			secretAccessKey: process.env.IAM_USER_SECRET || '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',
			Bucket: process.env.BUCKET_NAME || 'nrs-blockchain'
		});
		s3bucket.createBucket(function() {
			var params = {
				Bucket: process.env.BUCKET_NAME || 'nrs-blockchain',
				Key: fileName,
				Body: buffer
			};
			s3bucket.upload(params, function(err, data) {
				if (err) reject(err);
				console.log('Upload to S3: ', data);
				resolve(data);
			});
		});
	});
}

module.exports = { create, uploadToS3 };
