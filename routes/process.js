const express = require('express');
const Project = require('../classes/Project');
const Process = require('../classes/Process');
const NuclearPoE = require('../classes/NuclearPoE');
const { getKeys } = require('../functions/utils');

const router = express.Router({ mergeParams: true });

router.post('/create/:contract', async (req, res) => {
  try {
    const { wallet, privKey } = await getKeys(req.body);

    const process = new Project(wallet, privKey, req.params.contract);

    const result = await process.addProcess(
      req.body.supplierAddress,
      req.body.processTitle
    );

    res.json({ result });
  } catch (e) {
    res.json({ error: e.message });
  }
});

router.post('/get/:contract/:process', async (req, res) => {
  try {
    const { wallet, privKey } = await getKeys(req.body);
    const process = new Process(wallet, privKey, req.params.contract);

    const result = await process.returnProcessDetailsByOwner(
      req.params.process
    );

    res.json(result);
  } catch (e) {
    console.log(e);

    res.json({ error: e.message });
  }
});

router.post('/getAll/:contract', async (req, res) => {
  try {
    const { wallet, privKey } = await getKeys(req.body);
    const process = new Project(wallet, privKey, req.params.contract);

    const result = await process.returnAll('returnAllProcess');

    res.json({ result });
  } catch (e) {
    console.log(e);

    res.json({ error: e.message });
  }
});

module.exports = router;
