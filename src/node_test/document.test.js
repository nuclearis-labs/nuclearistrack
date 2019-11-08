const fs = require('fs');
const { saveToIPFS, getFromIPFS } = require('../../services/ipfs');

const { createSHA256 } = require('../../functions/hash');

const toBeType = require('jest-tobetype');
expect.extend(toBeType);

const file = { buffer: fs.readFileSync('./LICENSE') };

const desiredHashOutput =
  '0xc7e211ac55da7975448d2d722ba995b764e0bd1860878c41e1762468d3d98a04';

let docHash;

describe('Hash Functions', () => {
  test('Should return a valid SHA256 Hash with Hex Prefix', () => {
    docHash = createSHA256(file.buffer);
    expect(docHash).toBe(desiredHashOutput);
  });
});
let storageHash;
describe('IPFS File Storage', () => {
  test('Should upload the file as stream to Swarm', async () => {
    storageHash = await saveToIPFS(file.buffer);
    expect(storageHash).toBeType('string');
  });
  test('Should download the file and read the content into a buffer', async () => {
    const buffer = await getFromIPFS(storageHash);
    expect(buffer);
  });
});
