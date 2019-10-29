const utils = require('../functions/utils');

class Validator {
  static toCheckSumAddress(_address) {
    try {
      utils.isValidAddress(_address);
      const address = utils.toChecksumAddress(_address);
      return address;
    } catch (e) {
      throw Error(e);
    }
  }

  static asciiToHex(_string) {
    try {
      utils.isString(_string);
      const string = utils.toBytes32(_string);
      return string;
    } catch (e) {
      throw Error(e);
    }
  }

  static checkAndConvertNumber(_number) {
    try {
      const number = parseInt(_number, 10);
      utils.isNumber(number);
      return number;
    } catch (e) {
      throw Error(e);
    }
  }
}

module.exports = Validator;
