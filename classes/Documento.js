const Blockchain = require("./Blockchain"),
  documentModel = require("../models/document"),
  S3 = require("aws-sdk").S3;
/**
 * @name Documento
 * @desc Creates a file Instance
 * @namespace
 * @constructor
 * @param {Object} - El archivo cargado del front-end
 */
class Documento extends Blockchain {
  constructor(file) {
    super(file);
  }
  /**
   * Getter of file object
   * @name getFile
   * @function
   * @memberof Documento
   */
  get getFile() {
    return this.file;
  }

  /**
   * Getter of file extension
   * @name getExtension
   * @function
   * @memberof Documento
   */
  get getExtension() {
    let fileNameArray = this.file.originalname.split(".");
    if (fileNameArray.length > 1) {
      return fileNameArray[fileNameArray.length - 1];
    } else {
      throw Error("No se pudo definir la extension del archivo");
    }
  }

  async createRecord() {
    this.record = await documentModel.create({
      fileHash: this.getHash,
      transactionHash: this.transactionHash,
      fileName: `${this.getFile.originalname}`,
      visible: true
    });
    return this;
  }

  /**
   * Uploads document to AWS S3 Service
   * @name uploadToS3
   * @function
   * @memberof Documento
   */
  async uploadToS3() {
    return new Promise((resolve, reject) => {
      let s3bucket = new S3({
        accessKeyId: process.env.IAM_USER_KEY || "AKIAJ3TFNND5CHVIMOLA",
        secretAccessKey:
          process.env.IAM_USER_SECRET ||
          "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",
        Bucket: process.env.BUCKET_NAME || "nrs-blockchain"
      });

      s3bucket.createBucket(() => {
        var params = {
          Bucket: process.env.BUCKET_NAME || "nrs-blockchain",
          Key: this.record._id.toString(),
          Body: this.file.buffer
        };
        s3bucket.upload(params, (err, data) => {
          if (err) reject(err);
          this.uploadS3 = data;
          resolve(this);
        });
      });
    });
  }
}

module.exports = Documento;
