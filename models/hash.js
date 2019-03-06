const fs = require('fs'),
	AWS = require('aws-sdk'),
	middleware = require('../middleware/index'),
	crypto = require('crypto');

// creates a read stream of the uploaded file through multer
async function create(file, user) {
	return new Promise((resolve, reject) => {
		var fd = fs.createReadStream(file.path);

		var hash = crypto.createHash('sha256');

		// Defines the encoding as Hex
		hash.setEncoding('hex');

		fd.on(
			'end',
			middleware.asyncMiddleware(async () => {
				// When the Read Stream ends, end the hash object and read the obtained hash
				hash.end();
				var hashed = hash.read();
				hashed = '0x' + hashed;
				console.log('File hashed %s', hashed);
				console.log('File Containing');
				console.log(fd.buffer);
				let upload = await uploadToS3(fd.buffer, file, user).catch((err) => {
					console.log(err);
				});
				console.log(upload);

				//Once obtained the hash, delete the file from the server and console.log the deletion.
				/* fs.unlink(path, (err) => {
					if (err) throw err;
					console.log(path + ' was deleted');
				});
 */
				resolve(hashed);
			})
		);
		fd.on('error', function() {
			reject(error);
		});
		// read all file and pipe it (write it) to the hash object
		fd.pipe(hash);
	});
}

function uploadToS3(buffer, file, user) {
	let ext = file.originalname.slice(-3);
	return new Promise((reject, resolve) => {
		let s3bucket = new AWS.S3({
			accessKeyId: process.env.IAM_USER_KEY || 'AKIAJ3TFNND5CHVIMOLA',
			secretAccessKey: process.env.IAM_USER_SECRET || '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',
			Bucket: process.env.BUCKET_NAME || 'nrs-blockchain'
		});
		s3bucket.createBucket(function() {
			var params = {
				Bucket: process.env.BUCKET_NAME || 'nrs-blockchain',
				Key: user + '-2320-' + Date.now() + '.' + ext,
				Body: buffer
			};
			s3bucket.upload(params, function(err, data) {
				if (err) reject(err);
				resolve(data);
			});
		});
	});
}

module.exports = { create };
