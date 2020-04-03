const fs = require('fs');
const expect = require('chai').expect;
const { pinFileToIPFS } = require('../dist/config/ipfs.js');

const { createSHA256 } = require('../dist/config/hash.js');

const file = { buffer: fs.readFileSync('./LICENSE') };
const fileStream = fs.createReadStream('./LICENSE');
const desiredHashOutput =
  '0xf0b655778d4d1605f062800ee6053b648e0907279461f8c187bbf92684fcd6fe';

let docHash;

describe('Hash Functions', () => {
  it('Should return a valid SHA256 Hash with Hex Prefix', () => {
    docHash = createSHA256(file.buffer);
    expect(docHash).to.equal(desiredHashOutput);
  });
});
let storageHash;
describe('IPFS File Storage', () => {
  it('Should upload the file as stream to IPFS', async () => {
    const {
      data: { IpfsHash, PinSize, Timestamp }
    } = await pinFileToIPFS(fileStream);

    expect(IpfsHash).to.be.a('string');
  });
});
