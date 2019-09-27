const express = require('express');
const storage = require('multer').memoryStorage();
const upload = require('multer')({ storage });
const Process = require('../classes/Process');

const router = express.Router({ mergeParams: true });

router.post('/verify/:contract', upload.single('file'), async (req, res) => {
  try {
    const process = await new Process(
      req.params.contract,
      req.body.wallet,
      req.body.privateKey
    );

    const result = await process.verifyDocument(req.file);

    res.json({ result });
  } catch (e) {
    res.json({ error: e.message });
  }
});

router.post('/upload/:contract', upload.single('file'), async (req, res) => {
  try {
    const process = new Process(
      req.params.contract,
      req.body.wallet,
      req.body.privateKey
    );

    const result = await process.addDocument(
      req.body.supplierAddress,
      req.body.documentTitle,
      req.file
    );

    res.json({ result });
  } catch (e) {
    res.json({ error: e.message });
  }
});

router.post('/get/:contract', async (req, res) => {
  const process = new Process(
    req.params.contract,
    req.body.wallet,
    req.body.privateKey
  );
  try {
    const {
      documents,
      projectContractAddress
    } = await process.returnDocuments();
    res.json({ projectContractAddress, documents });
  } catch (e) {
    res.json({ error: e.message });
  }
});

module.exports = router;
