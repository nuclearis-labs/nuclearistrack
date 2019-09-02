/* eslint-disable no-unused-expressions */
const Documento = require('../classes/Documento');

const file = { originalname: 'test.pdf' };
const errorFile = { originalname: 2 };
const errorFile2 = { originalname: 'test' };

const Doc = new Documento(file, {
  wallet: '0xF691198C305eaDc10c2954202eA6b0BB38A76B43',
  private: 'b79493c56182cffcb710c1e084be41b2c076a59fdff37ffa540e720f28f7e26f'
});
const errorDoc = new Documento(errorFile, {
  wallet: '0xF691198C305eaDc10c2954202eA6b0BB38A76B43',
  private: 'b79493c56182cffcb710c1e084be41b2c076a59fdff37ffa540e720f28f7e26f'
});
const errorDoc2 = new Documento(errorFile2, {
  wallet: '0xF691198C305eaDc10c2954202eA6b0BB38A76B43',
  private: 'b79493c56182cffcb710c1e084be41b2c076a59fdff37ffa540e720f28f7e26f'
});

describe('Document Class', () => {
  test('should return object with information about file', () => {
    expect(Doc.getFile).toBeObject();
  });
  test('should return file extension', () => {
    expect(Doc.getExtension).toBe('pdf');
  });
  test('should throw TypeError', () => {
    expect(() => {
      errorDoc.getExtension;
    }).toThrowWithMessage(TypeError, 'Should be string');
  });
  test('should throw Error', () => {
    expect(() => {
      errorDoc2.getExtension;
    }).toThrowWithMessage(Error, 'No se pudo definir la extension del archivo');
  });
});
