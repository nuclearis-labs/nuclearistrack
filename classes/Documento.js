const Blockchain = require('./Blockchain'),
    documentModel = require('../models/document')

/**
 * @name Documento
 * @desc Creates a file Instance
 * @namespace
 * @constructor
 * @param {Object} - El archivo cargado del front-end
 */
class Documento extends Blockchain {
    constructor(keys) {
        super(keys)
    }
    /**
     * Getter of file object
     * @name getFile
     * @function
     * @memberof Documento
     */
    get getFile() {
        return this.file
    }

    /**
     * Getter of file extension
     * @name getExtension
     * @function
     * @memberof Documento
     */
    get getExtension() {
        let fileNameArray = this.file.originalname.split('.')
        if (fileNameArray.length > 1) {
            return fileNameArray[fileNameArray.length - 1]
        } else {
            throw Error('No se pudo definir la extension del archivo')
        }
    }
}

module.exports = Documento
