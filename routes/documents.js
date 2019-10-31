const express = require('express');
const storage = require('multer').memoryStorage();
const fs = require('fs');
const upload = require('multer')({ storage });
const { createSHA256 } = require('../functions/hash');
const Contract = require('../classes/Contract');
const { saveToIPFS, getFromIPFS } = require('../services/ipfs');
const processABI = JSON.parse(fs.readFileSync('build/contracts/Process.json'))
  .abi;
const bs58 = require('bs58');
const { verifyToken } = require('../middleware/index');
const {
  getKeys,
  isSHA256,
  toChecksumAddress,
  hexToAscii,
  asciiToHex,
  createPendingTx
} = require('../functions/utils');

const router = express.Router({ mergeParams: true });

router.post('/verify/:contract', upload.single('file'), async (req, res) => {
  try {
    const contractAddress = toChecksumAddress(req.params.contract);
    const documentHash = createSHA256(req.file.buffer);
    const contract = new Contract({ abi: processABI, contractAddress });
    const result = await contract.getDataFromContract({
      method: 'findDocument',
      data: [documentHash]
    });

    const storageHash = bs58.encode(
      Buffer.from(result[3] + result[4] + result[2].substr(2), 'hex')
    );

    res.json({
      mineTime: result[6],
      docNumber: result[5],
      documentHash,
      storageHash
    });
  } catch (e) {
    console.log(e);

    res.status(404).json({ error: e.message });
  }
});

router.get('/download/:contract/:hash', async (req, res) => {
  try {
    const hash = req.params.hash;
    const contractAddress = toChecksumAddress(req.params.contract);

    const contract = new Contract({ abi: processABI, contractAddress });
    const foundDoc = await contract.getDataFromContract({
      method: 'findDocument',
      data: [hash]
    });

    const storageHash = bs58.encode(
      Buffer.from(foundDoc[3] + foundDoc[4] + foundDoc[2].substr(2), 'hex')
    );
    const [{ content }] = await getFromIPFS(storageHash);

    res.json({
      mineTime: foundDoc[6],
      docNumber: foundDoc[5],
      hash,
      storageHash,
      buffer: content.toString('base64')
    });
  } catch (e) {
    console.log(e);
    res.json({ error: e.message });
  }
});

router.post(
  '/upload/:contract',
  verifyToken,
  upload.single('file'),
  async (req, res) => {
    try {
      const { wallet, privateKey } = await getKeys(req.body);

      const latitude = asciiToHex(req.body.latitude);
      const longitude = asciiToHex(req.body.longitude);
      const contractAddress = toChecksumAddress(req.params.contract);

      const documentHash = createSHA256(req.file.buffer);

      const storage = await saveToIPFS(req.file.buffer);
      const hexStorage = bs58.decode(storage).toString('hex');

      const storageFunction = hexStorage.substr(0, 2);
      const storageSize = hexStorage.substr(2, 2);
      const storageHash = hexStorage.substr(4);

      const contract = new Contract({
        privateKey,
        abi: processABI,
        contractAddress
      });

      const txHash = await contract.sendDataToContract({
        fromAddress: wallet,
        method: 'addDocument',
        data: [
          documentHash,
          Number(storageFunction),
          Number(storageSize),
          `0x${storageHash}`,
          latitude,
          longitude
        ]
      });

      await createPendingTx({
        txHash,
        subject: 'add-document',
        data: [documentHash]
      });

      res.json(txHash);
    } catch (e) {
      res.json({ error: e.message });
    }
  }
);

router.get('/get/:contract/', async (req, res) => {
  try {
    const contractAddress = toChecksumAddress(req.params.contract);
    const contract = new Contract({ abi: processABI, contractAddress });

    const result = await contract.getDataFromContract({
      method: 'getAllDocuments'
    });

    res.json(result);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

router.get('/get/:contract/:hash', async (req, res) => {
  try {
    const contractAddress = toChecksumAddress(req.params.contract);
    const contract = new Contract({ abi: processABI, contractAddress });

    const result = await contract.getDataFromContract({
      method: 'findDocument',
      data: [req.params.hash]
    });

    const storageHash = result[3] + result[4] + result[2].substr(2);

    res.json({
      latitude: result[0],
      longitude: result[1],
      storageHash: bs58.encode(Buffer.from(storageHash, 'hex')),
      docNumber: result[5],
      mineTime: result[6]
    });
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

module.exports = router;
