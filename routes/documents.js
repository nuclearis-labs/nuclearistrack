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
const { addDocNumber } = require('../functions/pdf');
const niv = require('../services/Validator');

const processABI = JSON.parse(fs.readFileSync('build/contracts/Process.json'))
  .abi;
const router = express.Router({ mergeParams: true });

router.post('/verify', upload.single('file'), async (req, res) => {
  try {
    const v = new niv.Validator(
      { body: req.body, params: req.query },
      {
        'body.file': 'required|mime:pdf|size:5mb,1kb',
        'query.contract': 'required|checksumAddress'
      }
    );

    const matched = await v.check();
    if (!matched) {
      res.status(422).send(v.errors);
    } else {
      const contractAddress = utils.toChecksumAddress(req.query.contract);
      const documentHash = createSHA256(req.file.buffer);
      const contract = new Contract({ abi: processABI, contractAddress });
      const details = await contract.getDataFromContract({
        method: 'getDocument',
        data: [documentHash]
      });

      res.json({
        docNumber: details[3],
        mineTime: details[4],
        latitude: utils.hexToAscii(details[1]),
        longitude: utils.hexToAscii(details[2]),
        documentHash,
        comment: details[5]
      });
    }
  } catch (e) {
    console.log(e);

    res.status(404).json({ error: e.message });
  }
});

router.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
  try {
    const v = new Validator(
      { body: req.body, query: req.query },
      {
        contract: 'required|checksumAddress',
        latitude: 'required|ascii',
        longitude: 'required|ascii',
        file: 'required|mime:pdf|size:5mb,1kb',
        email: 'required|email',
        passphrase: 'required|ascii',
        comment: 'required|ascii|length:140,3'
      }
    );

    const matched = await v.check();
    if (!matched) {
      res.status(422).send(v.errors);
    } else {
      const { address, privateKey } = await utils.getKeys(req.body);

      const latitude = utils.asciiToHex(req.body.latitude);
      const longitude = utils.asciiToHex(req.body.longitude);
      const contractAddress = utils.toChecksumAddress(req.query.contract);

      const NuclearPoEContract = new Contract();
      const rawDocNumber = await NuclearPoEContract.getDataFromContract({
        method: 'docNumber'
      });

      const FileBufferWithDocNumber = await addDocNumber({
        buffer: req.file.buffer,
        docNumber: `B-${rawDocNumber}`
      });

      const documentHash = createSHA256(FileBufferWithDocNumber);

      const storage = await saveToIPFS(FileBufferWithDocNumber);
      const hexStorage = bs58.decode(storage).toString('hex');

      const storageFunction = hexStorage.substr(0, 2);
      const storageSize = hexStorage.substr(2, 2);
      const storageHash = hexStorage.substr(4);

      const ProcessContract = new Contract({
        privateKey,
        abi: processABI,
        contractAddress
      });

      const txHash = await ProcessContract.sendDataToContract({
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
        data: [documentHash, `B-${rawDocNumber}`]
      });

      res.json(txHash);
    }
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
        docNumber: details[3],
        mineTime: details[4],
        latitude: utils.hexToAscii(details[1]),
        longitude: utils.hexToAscii(details[2]),
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
    const v = new Validator(
      { body: req.body, query: req.query },
      {
        contract: 'required|checksumAddress',
        hash: 'required|isSHA256'
      }
    );

    const matched = await v.check();
    if (!matched) {
      res.status(422).send(v.errors);
    } else {
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
        docNumber: details[3],
        mineTime: details[4],
        latitude: utils.hexToAscii(details[1]),
        longitude: utils.hexToAscii(details[2]),
        documentHash,
        storageHash,
        fileBuffer: file[0].content.toString('base64'),
        comment: details[5]
      });
    }
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

module.exports = router;
