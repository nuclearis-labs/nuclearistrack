const S3 = require("aws-sdk").S3;

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
        resolve(data);
      });
    });
  });
};
