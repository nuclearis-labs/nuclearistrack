const express = require('express');
const fs = require('fs');
const bs58 = require('bs58');
const storage = require('multer').memoryStorage();
const upload = require('multer')({ storage });

const Contract = require('../classes/Contract');
const { verifyToken } = require('../middleware/index');
const { saveToIPFS, getFromIPFS } = require('../services/ipfs');
const { createSHA256 } = require('../functions/hash');
const utils = require('../functions/utils');

const processABI = JSON.parse(fs.readFileSync('build/contracts/Process.json'))
  .abi;
const router = express.Router({ mergeParams: true });

router.post('/verify', upload.single('file'), async (req, res) => {
  try {
    const contractAddress = utils.toChecksumAddress(req.query.contract);
    const documentHash = createSHA256(req.file.buffer);
    const contract = new Contract({ abi: processABI, contractAddress });
    const details = await contract.getDataFromContract({
      method: 'getDocument',
      data: [documentHash]
    });

    res.json({
      docNumber: details[2],
      mineTime: details[3],
      latitude: utils.hexToAscii(details[0]),
      longitude: utils.hexToAscii(details[1]),
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
    const { address, privateKey } = await utils.getKeys(req.body);

    const latitude = utils.asciiToHex(req.body.latitude);
    const longitude = utils.asciiToHex(req.body.longitude);
    const contractAddress = utils.toChecksumAddress(req.query.contract);

    const documentHash = createSHA256(req.file.buffer);

    const storage = await saveToIPFS(req.file.buffer);
    const hexStorage = bs58.decode(storage).toString('hex');

    const storageFunction = hexStorage.substr(0, 2);
    const storageSize = hexStorage.substr(2, 2);
    const storageHash = hexStorage.substr(4);
    console.log(storageFunction);
    console.log(storageSize);
    console.log(storageHash);

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
        longitude,
        req.body.comment
      ]
    });

    await utils.createPendingTx({
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
    const contractAddress = utils.toChecksumAddress(req.query.contract);
    const contract = new Contract({ abi: processABI, contractAddress });

    const result = await contract.getDataFromContract({
      method: 'getAllDocuments'
    });

    const documents = [];
    for (let i = 0; i < result.length; i++) {
      const details = await contract.getDataFromContract({
        method: 'getDocument',
        data: [result[i]]
      });

      documents.push({
        docNumber: details[2],
        mineTime: details[3],
        latitude: utils.hexToAscii(details[0]),
        longitude: utils.hexToAscii(details[1]),
        documentHash: result[i]
      });
    }

    res.json(documents);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

router.get('/getOne', async (req, res) => {
  try {
    const documentHash = utils.isSHA256(req.query.hash);
    const contractAddress = utils.toChecksumAddress(req.query.contract);
    const contract = new Contract({ abi: processABI, contractAddress });

    const details = await contract.getDataFromContract({
      method: 'getDocument',
      data: [documentHash]
    });
    const storageDetails = await contract.getDataFromContract({
      method: 'getDocumentStorage',
      data: [documentHash]
    });

    const storageHash = bs58.encode(
      Buffer.from(
        storageDetails[1] + storageDetails[2] + storageDetails[0].substr(2),
        'hex'
      )
    );

    const file = await getFromIPFS(storageHash);

    res.json({
      docNumber: details[2],
      mineTime: details[3],
      latitude: utils.hexToAscii(details[0]),
      longitude: utils.hexToAscii(details[1]),
      documentHash,
      storageHash,
      fileBuffer: file[0].content.toString('base64'),
      comment: details[4]
    });
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

module.exports = router;
