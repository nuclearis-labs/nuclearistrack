const express = require('express');
const Project = require('../classes/Project');
const { getKeys } = require('../functions/utils');

const router = express.Router({ mergeParams: true });

router.post('/create/:contract', async (req, res) => {
  try {
    const email = req.body.newEmail;
    const passphrase = req.body.passphrase;
    const { wallet, privKey } = await getKeys(email, passphrase);

    const process = new Project(wallet, privKey);
    process.initiateContract(req.params.contract);

    const result = await process.addProcess(
      req.body.projectContractAddress,
      req.body.supplierAddress,
      req.body.processTitle,
      req.body.supplierName
    );

    res.json({ result });
  } catch (e) {
    res.json({ error: e.message });
  }
});

router.post('/get/:contract', async (req, res) => {
  try {
    const email = req.body.newEmail;
    const passphrase = req.body.passphrase;
    const { wallet, privKey } = await getKeys(email, passphrase);

    const process = new Project(wallet, privKey);
    process.initiateContract(req.params.contract);

    const {
      processList,
      projectContractAddress
    } = await process.getAllProcessByProject(req.body.contractAddress);

    res.json({ processList, projectContractAddress });
  } catch (e) {
    res.json({ error: e.message });
  }
});

module.exports = router;
