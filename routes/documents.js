const express = require('express');
const fs = require('fs');
const storage = require('multer').memoryStorage();
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
  asciiToHex,
  createPendingTx
} = require('../functions/utils');

const router = express.Router({ mergeParams: true });

router.post('/verify', upload.single('file'), async (req, res) => {
  try {
    const contractAddress = toChecksumAddress(req.query.contract);
    const documentHash = createSHA256(req.file.buffer);
    const contract = new Contract({ abi: processABI, contractAddress });
    const details = await contract.getDataFromContract({
      method: 'getDocument',
      data: [documentHash]
    });

    res.json({
      docNumber: details[2],
      mineTime: details[3],
      latitude: details[0],
      longitude: details[1],
      documentHash,
      comment: details[4]
    });
  } catch (e) {
    console.log(e);

    res.status(404).json({ error: e.message });
  }
});

router.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
  try {
    const { address, privateKey } = await getKeys(req.body);

    const latitude = asciiToHex(req.body.latitude);
    const longitude = asciiToHex(req.body.longitude);
    const contractAddress = toChecksumAddress(req.query.contract);

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
      fromAddress: address,
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
});

router.get('/get', async (req, res) => {
  try {
    const contractAddress = toChecksumAddress(req.query.contract);
    const contract = new Contract({ abi: processABI, contractAddress });

    const result = await contract.getDataFromContract({
      method: 'getAllDocuments'
    });

    res.json(result);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

router.get('/getOne', async (req, res) => {
  try {
    const documentHash = isSHA256(req.query.hash);
    const contractAddress = toChecksumAddress(req.query.contract);
    const contract = new Contract({ abi: processABI, contractAddress });

    const details = await contract.getDataFromContract({
      method: 'getDocument',
      data: [documentHash]
    });
    const storageDetails = await contract.getDataFromContract({
      method: 'getDocumentStorage',
      data: [documentHash]
    });

    const storageHash =
      storageDetails[2] + storageDetails[3] + storageDetails[1].substr(2);

    res.json({
      docNumber: details[2],
      mineTime: details[3],
      latitude: details[0],
      longitude: details[1],
      documentHash,
      storageHash: bs58.encode(Buffer.from(storageHash, 'hex')),
      comment: details[4]
    });
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

module.exports = router;
