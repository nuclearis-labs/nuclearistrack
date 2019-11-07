const fs = require('fs');
const bs58 = require('bs58');
const Contract = require('../classes/Contract');
const { saveToIPFS, getFromIPFS } = require('../services/ipfs');
const { createSHA256 } = require('../functions/hash');
const utils = require('../functions/utils');
const { addDocNumber } = require('../functions/pdf');
const processABI = JSON.parse(fs.readFileSync('build/contracts/Process.json'))
  .abi;
import logger from '../config/winston';

module.exports.verify = async (req, res) => {
  try {
    const documentHash = createSHA256(req.file.buffer);
    const contract = new Contract({
      abi: processABI,
      contractAddress: req.query.contract
    });
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
  } catch (e) {
    logger.error(`Document could not be verified`, {
      hash: documentHash,
      contract: req.query.contract
    });
    res.status(404).json({ error: e.message });
  }
};

module.exports.upload = async (req, res) => {
  try {
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
  } catch (e) {
    logger.error(`Document could not be uploaded `, {
      documentHash
    });
    res.json({ error: e.message });
  }
};

module.exports.get = async (req, res) => {
  try {
    const contract = new Contract({
      abi: processABI,
      contractAddress: req.query.contract
    });

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
    logger.error(`DocumentList could not be obtained `, {
      message: e.message
    });
    res.status(404).json({ error: e.message });
  }
};

module.exports.getOne = async (req, res) => {
  try {
    const contract = new Contract({
      abi: processABI,
      contractAddress: req.query.contract
    });

    const details = await contract.getDataFromContract({
      method: 'getDocument',
      data: [req.query.hash]
    });
    const storageDetails = await contract.getDataFromContract({
      method: 'getDocumentStorage',
      data: [req.query.hash]
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
      documentHash: req.query.hash,
      storageHash,
      fileBuffer: file[0].content.toString('base64'),
      comment: details[5]
    });
  } catch (e) {
    logger.error(`Document ${req.query.hash} could not be obtained `, {
      message: e.message
    });
    res.status(404).json({ error: e.message });
  }
};
