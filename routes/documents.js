const express = require('express');
const storage = require('multer').memoryStorage();
const upload = require('multer')({ storage });
const Process = require('../classes/Process');
const Document = require('../classes/Document');
const bs58 = require('bs58');
const {
  getKeys,
  isSHA256,
  toChecksumAddress,
  hexToAscii,
  asciiToHex
} = require('../functions/utils');

const router = express.Router({ mergeParams: true });

router.post('/verify/:contract', upload.single('file'), async (req, res) => {
  try {
    const contract = toChecksumAddress(req.params.contract);

    const document = new Document(req.file).createHash();

    const process = new Process(undefined, undefined, contract);
    const result = await process.verifyDocument(document.getHash);

    if (result === undefined) {
      res.json(false);
    } else {
      res.json(result);
    }
  } catch (e) {
    res.json({ error: e.message });
  }
});

router.post('/download/:contract/:hash', async (req, res) => {
  try {
    const hash = isSHA256(req.params.hash);
    const contract = toChecksumAddress(req.params.contract);

    const process = new Process(undefined, undefined, contract);

    const doc = new Document();
    const [{ content }] = await doc.getFromIPFS(hash);

    const [mineTime, name, storageHash] = await process.downloadDocument(hash);

    res.json({
      mineTime,
      name: hexToAscii(name),
      hash,
      storageHash,
      buffer: content.toString('base64')
    });
  } catch (e) {
    console.log(e);
    res.json({ error: e.message });
  }
});

router.post('/upload/:contract', upload.single('file'), async (req, res) => {
  try {
    const { wallet, privKey } = await getKeys(req.body);
    const latitude = asciiToHex(req.body.latitude);
    const longitude = asciiToHex(req.body.longitude);
    const contract = toChecksumAddress(req.params.contract);

    const document = new Document(file);
    document.createHash();

    const storage = await document.saveToIPFS();
    const hexStorage = bs58.decode(storage);

    const storageFunction = hexStorage.substr(0, 2);
    const storageSize = hexStorage.substr(2, 4);
    const storageHash = hexStorage.substr(4);

    const process = new Process(wallet, privKey, contract);
    const result = await process.addDocument([
      document.getHash,
      storageFunction,
      storageSize,
      storageHash,
      latitude,
      longitude
    ]);

    res.json({ result });
  } catch (e) {
    res.json({ error: e.message });
  }
});

router.post('/get/:contract', async (req, res) => {
  try {
    const contract = toChecksumAddress(req.params.contract);
    const process = new Process(undefined, undefined, contract);
    const result = await process.returnDocuments();
    res.json(result);
  } catch (e) {
    res.json({ error: e.message });
  }
});

module.exports = router;
