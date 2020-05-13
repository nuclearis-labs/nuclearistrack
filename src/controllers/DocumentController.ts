import bs58 from 'bs58';
import Contract from '../classes/Contract';
import { pinFileToIPFS } from '../config/ipfs';
import { createSHA256 } from '../config/hash';
import * as utils from '../config/utils';
import * as pending from '../config/pendingTx';
import { Request, Response } from 'express';
import logger from '../config/winston';
import { IFileOnReq } from '../types/Custom';
import zlib from 'zlib';
import crypto from 'crypto';
import axios from 'axios';

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

    let iv = Buffer.alloc(16); // iv should be 16
    let key = Buffer.alloc(32); // key should be 32 bytes
    key = Buffer.concat(
      [Buffer.from(process.env.ENCRYPTION_PASSPHRASE)],
      key.length
    );
    let cipher;

    // randomize the iv, for best results
    (iv = Buffer.from(
      Array.prototype.map.call(iv, () => {
        return Math.floor(Math.random() * 256);
      })
    )),
      // make the cipher with the current suite, key, and iv
      (cipher = crypto.createCipheriv('aes-256-cbc', key, iv));

    const hashStream = new HashStream('sha256');
    const appendVect = new AppendInitVect(iv);

    let bufs = [];
    let buffer;

    req.file.stream
      .pipe(hashStream)
      .pipe(zlib.createGzip())
      .pipe(cipher)
      .pipe(appendVect)
      .on('data', chunk => {
        bufs.push(chunk);
      })
      .on('finish', () => {
        buffer = Buffer.concat(bufs);

        pinFileToIPFS(buffer, hashStream.hash).then(({ data }) => {
          const hexStorage = bs58.decode(data.IpfsHash).toString('hex');
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
              req.file.originalName.substr(
                0,
                req.file.originalName.length -
                  req.file.detectedFileExtension.length
              ),
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

export async function getOneFile(req: Request, res: Response) {
  try {
    let key = Buffer.alloc(32);
    key = Buffer.concat(
      [Buffer.from(process.env.ENCRYPTION_PASSPHRASE)],
      key.length
    );

    const { data } = await axios({
      method: 'get',
      responseType: 'stream',
      url: `https://gateway.pinata.cloud/ipfs/${req.query.storageHash}`
    });

    let iv = Buffer.from(data.read(16), 'hex');

    data
      .pipe(crypto.createDecipheriv('aes-256-cbc', key, iv))
      .pipe(zlib.createGunzip())
      .pipe(res);
  } catch (e) {
    logger.error(`Document ${req.query.hash} could not be obtained `, {
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

    res.json({
      name: details[0],
      docNumber: details[3],
      mineTime: details[4],
      latitude: utils.hexToAscii(details[1]),
      longitude: utils.hexToAscii(details[2]),
      documentHash: req.query.hash,
      storageHash,
      comment: details[5]
    });
  } catch (e) {
    logger.error(
      `Documentinformation ${req.query.hash} could not be obtained `,
      {
        message: e.message
      }
    );
    res.status(404).json({ error: e.message });
  }
}
