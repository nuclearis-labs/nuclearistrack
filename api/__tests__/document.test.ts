import fs from 'fs';
import { pinFileToIPFS } from '../src/config/ipfs';
import { createSHA256 } from '../src/config/hash';

const file = { buffer: fs.readFileSync('./LICENSE') };
const fileStream = fs.createReadStream('./LICENSE');
const desiredHashOutput =
  '0xf0b655778d4d1605f062800ee6053b648e0907279461f8c187bbf92684fcd6fe';

let docHash;

describe('Hash Functions', () => {
  it('Should return a valid SHA256 Hash with Hex Prefix', () => {
    docHash = createSHA256(file.buffer);
    expect(docHash).toEqual(desiredHashOutput);
  });
});
let storageHash;
describe('IPFS File Storage', () => {
  it('Should upload the file as stream to IPFS', async () => {
    const {
      data: { IpfsHash }
    } = await pinFileToIPFS(
      fileStream,
      '0xf0b655778d4d1605f062800ee6053b648e0907279461f8c187bbf92684fcd6fe'
    );

    expect(typeof IpfsHash).toBe('string');
  });
});
