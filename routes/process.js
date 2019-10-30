const express = require('express');
const Contract = require('../classes/Contract');
const web3 = require('web3');
const processABI = JSON.parse(fs.readFileSync('build/contracts/Process.json'))
  .abi;
const {
  getKeys,
  web3ArrayToJSArray,
  createPendingTx
} = require('../functions/utils');

const router = express.Router({ mergeParams: true });

router.post('/create/:contract', async (req, res) => {
  try {
    const { wallet, privateKey } = await getKeys(req.body);
    const contract = new Contract({
      privateKey,
      abi: processABI,
      contractAddress: req.params.contract
    });
    const txHash = await contract.sendDataToContract({
      fromAddress: wallet,
      method: 'createProcess',
      data: [req.body.supplierAddress, req.body.processTitle]
    });

    await createPendingTx({
      txHash,
      subject: 'add-process',
      data: [req.body.processTitle, req.body.supplierAddress]
    });

    res.json(txHash);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e.message });
  }
});

router.post('/get/:contract/:process', async (req, res) => {
  try {
    const contract = new Contract({ abi: processABI });

    const result = await contract.getDataFromContract({
      method: 'returnProcessByOwner',
      arg: req.params.process
    });

    res.json(result);
  } catch (e) {
    console.log(e);

    res.json({ error: e.message });
  }
});

router.post('/getAll/:contract', async (req, res) => {
  try {
    const contract = new Contract({
      abi: processABI,
      contractAddress: req.params.contract
    });

    const result = await contract.getDataFromContract({
      method: 'returnAllProcess'
    });

    let resultProcessed = [];
    for (let i = 0; i < result.length; i++) {
      const userName = await contract.getDataFromContract({
        method: 'getUserDetails',
        data: [result[i]]
      });
      const details = await contract.getDataFromContract({
        method: 'returnProcessByOwner',
        data: [result[i]]
      });
      const convertedResult = web3ArrayToJSArray(details);
      resultProcessed.push([
        web3.utils.toAscii(convertedResult[0]),
        web3.utils.toAscii(userName[0]),
        convertedResult[1]
      ]);
    }
    res.json([resultProcessed]);
  } catch (e) {
    console.log(e);

    res.json({ error: e.message });
  }
});

module.exports = router;
