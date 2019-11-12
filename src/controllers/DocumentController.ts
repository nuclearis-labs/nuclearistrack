import fs from 'fs';
import bs58 from 'bs58';
import Contract from '../classes/Contract';
import { saveToIPFS, getFromIPFS } from '../config/ipfs';
import { createSHA256 } from '../config/hash';
import * as utils from '../config/utils';
import { addDocNumber } from '../config/pdf';
import { Request, Response } from 'express';
import logger from '../config/winston';

const processABI = require('../../build/contracts/Process.json').abi;

export async function verify(req: Request, res: Response) {
  let documentHash: string;
  try {
    documentHash = createSHA256(req.file.buffer);
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
}

export async function upload(req: Request, res: Response) {
  let documentHash: string;
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

    documentHash = createSHA256(FileBufferWithDocNumber);

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
}

export async function get(req: Request, res: Response) {
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
}

export async function getOne(req: Request, res: Response) {
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
}