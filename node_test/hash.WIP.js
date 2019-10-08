const Blockchain = require('../classes/Blockchain');

const Block = new Blockchain(
  '0xbfa1e9e5215276f18ff02328a42e4b44aa8740fd',
  '0xa2f82151e0bcdad8f9b0c4d0c7ce43634d47494c4c3a9a95a1604ef150bd4afa'
);

const string = Buffer.from('hello');
const desiredHashOutput = {
  documentHash:
    '0x2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'
};
describe('Hash Functions', () => {
  test('Should return a valid SHA256 Hash with Hex Prefix', () => {
    expect(Block.createHash({ buffer: string })).toMatchObject(
      desiredHashOutput
    );
  });

  test('Should return hash from Blockchain Prototype', () => {
    expect(Block.getHash).toBe(
      '0x2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'
    );
  });
});
