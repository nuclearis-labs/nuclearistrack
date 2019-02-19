const fs = require('fs'),
	crypto = require('crypto');

// creates a read stream of the uploaded file through multer
async function create(path) {
	return new Promise((resolve, reject) => {
		var fd = fs.createReadStream(path);

		var hash = crypto.createHash('sha256');

		// Defines the encoding as Hex
		hash.setEncoding('hex');

		fd.on('end', function() {
			// When the Read Stream ends, end the hash object and read the obtained hash
			hash.end();
			var hashed = hash.read();
			hashed = '0x' + hashed;
			console.log('File hashed %s', hashed);

			/*//Once obtained the hash, delete the file from the server and console.log the deletion.
			fs.unlink(path, (err) => {
				if (err) throw err;
				console.log(path + ' was deleted');
			}); */

			resolve(hashed);
		});
		fd.on('error', function() {
			reject(error);
		});
		// read all file and pipe it (write it) to the hash object
		fd.pipe(hash);
	});
}

module.exports = { create };
