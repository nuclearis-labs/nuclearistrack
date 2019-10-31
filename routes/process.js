const express = require('express');
const Contract = require('../classes/Contract');
const web3 = require('web3');
const fs = require('fs');
const processABI = JSON.parse(fs.readFileSync('build/contracts/Process.json'))
  .abi;
const {
  getKeys,
  web3ArrayToJSArray,
  createPendingTx,
  asciiToHex,
  hexToAscii,
  toChecksumAddress
} = require('../functions/utils');

const router = express.Router({ mergeParams: true });

router.post('/create/', async (req, res) => {
  try {
    const { wallet, privateKey } = await getKeys(req.body);

    const processTitle = asciiToHex(req.body.processTitle);
    const supplierAddress = toChecksumAddress(req.body.supplierAddress);

    const contract = new Contract({
      privateKey
    });
    const txHash = await contract.sendDataToContract({
      fromAddress: wallet,
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

router.get('/get/:contract', async (req, res) => {
  try {
    const contract = new Contract();

    const process = new Contract({
      abi: processABI,
      contractAddress: req.params.contract
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
      processName: details[3],
      allDocuments: details[4],
      contractAddress: details[5]
    });
  } catch (e) {
    console.log(e);

    res.json({ error: e.message });
  }
});

router.get('/getAll/', async (req, res) => {
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
      console.log(result[i]);

      const details = await process.getDataFromContract({
        method: 'getDetails'
      });
      console.log(details);

      const userName = await contract.getDataFromContract({
        method: 'getUserDetails',
        data: [details[2]]
      });
      resultProcessed.push({
        NuclearPoEAddress: details[0],
        MOAddress: details[1],
        supplierAddress: details[2],
        supplierName: hexToAscii(userName[0]),
        processName: details[3],
        allDocuments: details[4],
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
