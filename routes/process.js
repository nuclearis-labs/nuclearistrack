const express = require('express');
const Blockchain = require('../classes/Blockchain');
const router = express.Router({ mergeParams: true });

router.post('/', async (req, res) => {
  let process = new Blockchain(req.body.wallet, req.body.privateKey);
  try {
    await process.addProcess(
      Number(req.body.expediente),
      req.body.supplierAddress,
      req.body.processTitle,
      req.body.supplierName
    );

    let tx = await process.sendTx(process.projectContractAddress);
    res.json({ tx });
  } catch (e) {
    res.json({ error: e.message });
  }
});

router.post('/get', async (req, res) => {
  let process = new Blockchain(req.body.wallet, req.body.privateKey);
  try {
    let { processList, projectContractAddress } = await process.getProcess(
      req.body.expediente
    );
    res.json({ processList, projectContractAddress });
  } catch (e) {
    res.json({ error: e.message });
  }
});

module.exports = router;
