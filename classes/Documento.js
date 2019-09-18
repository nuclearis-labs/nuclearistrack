const Blockchain = require('./Blockchain');

/**
 * @name Documento
 * @desc Creates a file Instance
 * @namespace
 * @constructor
 * @param {Object} - El archivo cargado del front-end
 */
class Documento extends Blockchain {
  constructor(file, wallet, privateKey) {
    super(wallet, privateKey);
    this.file = file;
  }

  /**
   * Getter of file extension
   * @name getExtension
   * @function
   * @memberof Documento
   */
  get getExtension() {
    const fileNameArray = this.file.originalname.split('.');
    if (fileNameArray.length > 1) {
      return fileNameArray[fileNameArray.length - 1];
    }
    throw Error('No se pudo definir la extension del archivo');
  }
}

module.exports = Documento;
