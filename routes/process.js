const express = require('express');
const Contract = require('../classes/Contract');
const fs = require('fs');
const { verifyToken } = require('../middleware/index');
const processABI = JSON.parse(fs.readFileSync('build/contracts/Process.json'))
  .abi;
const {
  getKeys,
  createPendingTx,
  asciiToHex,
  hexToAscii,
  toChecksumAddress
} = require('../functions/utils');

const router = express.Router({ mergeParams: true });

router.post('/create/', verifyToken, async (req, res) => {
  try {
    const { address, privateKey } = await getKeys(req.body);

    const processTitle = asciiToHex(req.body.processTitle);
    const supplierAddress = toChecksumAddress(req.body.supplierAddress);

    const contract = new Contract({
      privateKey
    });
    const txHash = await contract.sendDataToContract({
      fromAddress: address,
      method: 'createProcess',
      data: [supplierAddress, processTitle]
    });

    await createPendingTx({
      txHash,
      subject: 'add-process',
      data: [req.body.processTitle, supplierAddress]
    });

    res.json(txHash);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e.message });
  }
});

router.get('/getOne', async (req, res) => {
  try {
    const contract = new Contract();

    const process = new Contract({
      abi: processABI,
      contractAddress: req.query.contract
    });

    const details = await process.getDataFromContract({
      method: 'getDetails'
    });

    const userName = await contract.getDataFromContract({
      method: 'getUserDetails',
      data: [details[2]]
    });

    res.json({
      NuclearPoEAddress: details[0],
      MOAddress: details[1],
      supplierAddress: details[2],
      supplierName: hexToAscii(userName[0]),
      processName: hexToAscii(details[3]),
      allDocuments: details[4],
      contractAddress: details[5]
    });
  } catch (e) {
    console.log(e);

    res.json({ error: e.message });
  }
});

router.get('/getByExpediente', async (req, res) => {
  try {
    const contract = new Contract();

    const details = await contract.getDataFromContract({
      method: 'getProcessContractsByProject',
      data: [req.query.expediente]
    });

    let response = [];
    for (let i = 0; i < details.length; i++) {
      const process = new Contract({
        abi: processABI,
        contractAddress: details[i]
      });
      let result = await process.getDataFromContract({
        method: 'getDetails'
      });
      const userName = await contract.getDataFromContract({
        method: 'getUserDetails',
        data: [result[2]]
      });
      response.push({
        NuclearPoEAddress: result[0],
        MOAddress: result[1],
        supplierAddress: result[2],
        supplierName: hexToAscii(userName[0]),
        processName: hexToAscii(result[3]),
        allDocuments: result[4],
        contractAddress: result[5]
      });
    }

    res.json(response);
  } catch (e) {
    console.log(e);

    res.json({ error: e.message });
  }
});

router.get('/get', async (req, res) => {
  try {
    const contract = new Contract();

    const result = await contract.getDataFromContract({
      method: 'getAllProcessContracts'
    });

    let resultProcessed = [];
    for (let i = 0; i < result.length; i++) {
      const process = new Contract({
        abi: processABI,
        contractAddress: result[i]
      });

      const details = await process.getDataFromContract({
        method: 'getDetails'
      });

      const userName = await contract.getDataFromContract({
        method: 'getUserDetails',
        data: [details[2]]
      });
      resultProcessed.push({
        supplierAddress: details[2],
        supplierName: hexToAscii(userName[0]),
        processName: hexToAscii(details[3]),
        contractAddress: details[5]
      });
    }
    res.json(resultProcessed);
  } catch (e) {
    console.log(e);

    res.json({ error: e.message });
  }
});

module.exports = router;
