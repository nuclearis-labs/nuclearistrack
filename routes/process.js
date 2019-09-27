const express = require('express');
const storage = require('multer').memoryStorage();
const upload = require('multer')({ storage });
const Project = require('../classes/Project');
const Process = require('../classes/Process');

const router = express.Router({ mergeParams: true });

router.post('/create/:contract', async (req, res) => {
  const process = new Project(
    req.params.contract,
    req.body.wallet,
    req.body.privateKey
  );
  try {
    const result = await process.addProcess(
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
  const process = new Project(
    req.params.contract,
    req.body.wallet,
    req.body.privateKey
  );
  try {
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
