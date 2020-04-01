import fs, { truncateSync } from 'fs';
import bs58 from 'bs58';
import Contract from '../classes/Contract';
import stream from 'stream';
import { HashStream, PDFModStream } from '../config/streams';
import { pdfFn } from '../config/pdf';
import { pinFileToIPFS, getFromPinata } from '../config/ipfs';
import { createSHA256 } from '../config/hash';
import * as utils from '../config/utils';
import * as pending from '../config/pendingTx';
import { Request, Response } from 'express';
import logger from '../config/winston';
import { IFileOnReq } from '../types/Custom';

const processABI = require('../../build/contracts/Process.json').abi;

export async function verify(req: IFileOnReq, res: Response) {
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
      name: details[0],
      docNumber: details[4],
      mineTime: details[5],
      latitude: utils.hexToAscii(details[2]),
      longitude: utils.hexToAscii(details[3]),
      documentHash,
      comment: details[6]
    });
  } catch (e) {
    logger.error(`Document could not be verified`, {
      hash: documentHash,
      contract: req.query.contract
    });
    res.status(404).json({ error: e.message });
  }
}

export async function upload(req: IFileOnReq, res: Response) {
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

    const pdfStream = new PDFModStream(pdfFn, `B-${rawDocNumber}`);
    const hashStream = new HashStream('sha256');

    req.file.stream.pipe(pdfStream).pipe(hashStream);

    hashStream.on('finish', () => {
      pinFileToIPFS(hashStream).then(result => {
        const hexStorage = bs58.decode(result.data.IpfsHash).toString('hex');

        const storageFunction = hexStorage.substr(0, 2);
        const storageSize = hexStorage.substr(2, 2);
        const storageHash = hexStorage.substr(4);

        const ProcessContract = new Contract({
          privateKey,
          abi: processABI,
          contractAddress
        });

        ProcessContract.sendDataToContract({
          fromAddress: address,
          method: 'addDocument',
          data: [
            req.body.name,
            hashStream.hash,
            Number(storageFunction),
            Number(storageSize),
            `0x${storageHash}`,
            latitude,
            longitude,
            req.body.comment
          ]
        })
          .then(txHash => {
            pending
              .create({
                txHash,
                subject: 'add-document',
                data: [hashStream.hash, `B-${rawDocNumber}`]
              })
              .then(() => {
                res.json(txHash);
              })
              .catch(e => {
                logger.error(e.message, {
                  documentHash
                });
                res.json({ error: e.message });
              });
          })
          .catch(e => {
            logger.error(e.message, {
              documentHash
            });
            res.json({ error: e.message });
          });
      });
    });
  } catch (e) {
    console.log(e);

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
        name: details[0],
        docNumber: details[3],
        mineTime: details[4],
        latitude: utils.hexToAscii(details[1]),
        longitude: utils.hexToAscii(details[2]),
        documentHash: result[i],
        comment: details[5]
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

    const file = await getFromPinata(storageHash);

    res.json({
      name: details[0],
      docNumber: details[3],
      mineTime: details[4],
      latitude: utils.hexToAscii(details[1]),
      longitude: utils.hexToAscii(details[2]),
      documentHash: req.query.hash,
      storageHash,
      fileBuffer: Buffer.from(file.data).toString('base64'),
      comment: details[5]
    });
  } catch (e) {
    logger.error(`Document ${req.query.hash} could not be obtained `, {
      message: e.message
    });
    res.status(404).json({ error: e.message });
  }
}
