const { expect } = require('chai');
const Documento = require('../classes/Documento');

describe('functions in ../functions/file.js', () => {
  it('getExtension getter should obtain the file extension', () => {
    const extension = new Documento({ originalname: 'README.MD' }).getExtension;

    expect(extension).to.be.a('string');
    expect(extension).to.have.lengthOf.within(2, 4);
  });
});
