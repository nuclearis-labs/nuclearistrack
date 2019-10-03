const utils = require('../functions/utils');

class Validator {
  static checkAndConvertAddress(_address) {
    try {
      utils.isValidAddress(_address);
      const address = utils.toChecksumAddress(_address);
      return address;
    } catch (e) {
      throw Error(e);
    }
  }

  static checkAndConvertString(_string) {
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
      utils.isNumber(parseInt(_number, 10));
    } catch (e) {
      throw Error(e);
    }
  }
}

module.exports = Validator;
