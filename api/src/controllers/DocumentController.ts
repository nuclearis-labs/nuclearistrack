import Contract from '../classes/Contract';
import * as utils from '../config/utils';
import { Request, Response } from 'express';
import logger from '../config/winston';
import { IFileOnReq } from '../types/Custom';

const processABI = require('../../build/contracts/Process.json').abi;

export async function verify(req: IFileOnReq, res: Response) {
  let documentHash: string;
  try {
    //Implement document verification process
    res.sendStatus(404);
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
    const { address, privateKey } = await utils.getKeys({
      email: req.user.userEmail,
      passphrase: req.body.passphrase
    });

    const latitude = utils.asciiToHex(req.body.latitude);
    const longitude = utils.asciiToHex(req.body.longitude);
    const contractAddress = utils.toChecksumAddress(
      req.query.contract.toString()
    );

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
          req.file.originalName.length - req.file.detectedFileExtension.length
        ),
        latitude,
        longitude,
        req.body.comment
      ]
    })
      .then(txHash => {
        res.json(txHash);
      })
      .catch(e => {
        logger.error(e.message, {
          documentHash
        });
        res.status(401).json({ error: e.message });
      });
  } catch (e) {
    logger.error(`Document could not be uploaded `, {
      documentHash
    });
    console.error(e);

    res.status(401).json({ error: e.message });
  }
}

export async function get(req: Request, res: Response) {
  try {
    const contract = new Contract({
      abi: processABI,
      contractAddress: req.query.contract.toString()
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
        mineTime: details[3],
        latitude: utils.hexToAscii(details[1]),
        longitude: utils.hexToAscii(details[2]),
        documentHash: result[i],
        comment: details[4]
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
      contractAddress: req.query.contract.toString()
    });

    const details = await contract.getDataFromContract({
      method: 'getDocument',
      data: [req.query.hash.toString()]
    });

    res.json({
      name: details[0],
      mineTime: details[3],
      latitude: utils.hexToAscii(details[1]),
      longitude: utils.hexToAscii(details[2]),
      documentHash: req.query.hash,
      comment: details[4]
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
