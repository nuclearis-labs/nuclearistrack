const Document = require('../classes/Document');
const fs = require('fs');

const toBeType = require('jest-tobetype');
expect.extend(toBeType);

const file = { buffer: fs.readFileSync('./LICENSE') };

const desiredHashOutput = {
  documentHash:
    '0xc7e211ac55da7975448d2d722ba995b764e0bd1860878c41e1762468d3d98a04'
};
const doc = new Document(file);

describe('Hash Functions', () => {
  test('Should return a valid SHA256 Hash with Hex Prefix', () => {
    expect(doc.createHash(file)).toMatchObject(desiredHashOutput);
  });

  test('Should return hash from Blockchain Prototype', () => {
    expect(doc.getHash).toBe(
      '0xc7e211ac55da7975448d2d722ba995b764e0bd1860878c41e1762468d3d98a04'
    );
  });
});
let storageHash;
describe('Swarm File Storage', () => {
  test('Should upload the file as stream to Swarm', async () => {
    storageHash = await doc.save();
    expect(storageHash).toBeType('string');
  });
  test('Should download the file and read the content into a buffer', async () => {
    doc.storageHash = storageHash;
    const buffer = await doc.get();
    expect(buffer);
  });
});
