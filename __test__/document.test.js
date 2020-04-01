const fs = require('fs');
const { saveToIPFS, getFromIPFS } = require('../dist/config/ipfs.js');

const { createSHA256 } = require('../dist/config/hash.js');

const toBeType = require('jest-tobetype');
expect.extend(toBeType);

const file = { buffer: fs.readFileSync('./LICENSE') };

const desiredHashOutput =
  '0xf0b655778d4d1605f062800ee6053b648e0907279461f8c187bbf92684fcd6fe';

let docHash;

describe('Hash Functions', () => {
  test('Should return a valid SHA256 Hash with Hex Prefix', () => {
    docHash = createSHA256(file.buffer);
    expect(docHash).toBe(desiredHashOutput);
  });
});
let storageHash;
describe('IPFS File Storage', () => {
  test('Should upload the file as stream to IPFS', async () => {
    storageHash = await saveToIPFS(file.buffer);
    expect(storageHash).toBeType('string');
  });
  test('Should download the file and read the content into a buffer', async () => {
    const buffer = await getFromIPFS(storageHash);
    expect(buffer);
  });
});
