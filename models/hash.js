const fs = require('fs'),
	crypto = require('crypto');

// creates a read stream of the uploaded file through multer
function hash(path, callback) {
	var fd = fs.createReadStream(path);

	var hash = crypto.createHash('sha256');

	// Defines the encoding as Hex
	hash.setEncoding('hex');

	fd.once('end', function() {
		// When the Read Stream ends, end the hash object and read the obtained hash
		hash.end();
		var hashed = hash.read();
		hashed = '0x' + hashed;
		console.log(hashed);

		// Once obtained the hash, delete the file from the server and console.log the deletion.
		fs.unlink(path, (err) => {
			if (err) throw err;
			console.log(path + ' was deleted');
		});
		callback(null, hashed);
	});
	// read all file and pipe it (write it) to the hash object
	fd.pipe(hash);
}

module.exports = { hash };
