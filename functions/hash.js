const S3 = require("aws-sdk").S3,
  { createHash } = require("crypto");

// creates a read stream of the uploaded file through multer
module.exports.create = async function create(buffer) {
  return new Promise((resolve, reject) => {
    resolve(
      "0x" +
        createHash("sha256")
          .update(buffer)
          .digest("hex")
    );
  });
};

module.exports.uploadToS3 = function uploadToS3(buffer, fileName) {
  return new Promise((resolve, reject) => {
    let s3bucket = new S3({
      accessKeyId: process.env.IAM_USER_KEY || "AKIAJ3TFNND5CHVIMOLA",
      secretAccessKey:
        process.env.IAM_USER_SECRET ||
        "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",
      Bucket: process.env.BUCKET_NAME || "nrs-blockchain"
    });
    s3bucket.createBucket(function() {
      var params = {
        Bucket: process.env.BUCKET_NAME || "nrs-blockchain",
        Key: fileName,
        Body: buffer
      };
      s3bucket.upload(params, function(err, data) {
        if (err) reject(err);
        console.log("Upload to S3: ", data);
        resolve(data);
      });
    });
  });
};
