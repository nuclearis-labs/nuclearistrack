const express = require('express');
const Project = require('../classes/Project');
const Process = require('../classes/Process');
const NuclearPoE = require('../classes/NuclearPoE');
const { getKeys } = require('../functions/utils');

const router = express.Router({ mergeParams: true });

router.post('/create/:contract', async (req, res) => {
  try {
    const { wallet, privKey } = await getKeys(req.body);

    const process = new NuclearPoE(wallet, privKey);

    const result = await process.addProcessToProject(
      req.body.supplierAddress,
      req.params.contract,
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

    const result = await process.returnDocuments();

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

    const result = await process.returnAll(
      'supplierCount',
      'supplierAddresses'
    );

    res.json({ result });
  } catch (e) {
    console.log(e);

    res.json({ error: e.message });
  }
});

module.exports = router;
