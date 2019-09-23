const toBeType = require('jest-tobetype');
const Documento = require('../classes/Documento');

expect.extend(toBeType);

describe('functions in ../functions/file.js', () => {
  it('getExtension getter should obtain the file extension', () => {
    const extension = new Documento(
      { originalname: 'README.MD' },
      '0xbfa1e9e5215276f18ff02328a42e4b44aa8740fd',
      '0xa2f82151e0bcdad8f9b0c4d0c7ce43634d47494c4c3a9a95a1604ef150bd4afa'
    ).getExtension;

    expect(extension).toBeType('string');
    expect(extension).toBe('MD');
    expect(extension).toHaveLength(2);
  });
});
