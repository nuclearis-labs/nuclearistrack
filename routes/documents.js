const express = require('express');
const storage = require('multer').memoryStorage();
const upload = require('multer')({ storage });
const Process = require('../classes/Process');
const web3 = require('web3');
const { getKeys } = require('../functions/utils');

const router = express.Router({ mergeParams: true });

router.post('/verify/:contract', upload.single('file'), async (req, res) => {
  try {
    const { wallet, privKey } = await getKeys(req.body);

    const process = new Process(wallet, privKey, req.params.contract);

    const result = await process.verifyDocument(req.file);

    res.json({ result });
  } catch (e) {
    res.json({ error: e.message });
  }
});

router.post('/download/:contract/:hash', async (req, res) => {
  try {
    const process = new Process(undefined, undefined, req.params.contract);

    const result = await process.downloadDocument(req.params.hash);
    console.log(result);

    res.json({
      mineTime: result.data[0],
      name: web3.utils.toAscii(result.data[1]),
      hash: req.params.hash,
      storageHash: result.data[2],
      buffer: result.buffer[0].content.toString('base64')
    });
  } catch (e) {
    console.log(e);
    res.json({ error: e.message });
  }
});

router.post('/upload/:contract', upload.single('file'), async (req, res) => {
  try {
    const { wallet, privKey } = await getKeys(req.body);

    const process = new Process(wallet, privKey, req.params.contract);

    const result = await process.addDocument(req.body.documentTitle, req.file);
    console.log(result);

    res.json({ result });
  } catch (e) {
    console.log(e);

    res.json({ error: e.message });
  }
});

router.post('/get/:contract', async (req, res) => {
  try {
    const process = new Process(undefined, undefined, req.params.contract);

    const result = await process.returnDocuments();
    console.log(result);

    res.json(result);
  } catch (e) {
    res.json({ error: e.message });
  }
});

module.exports = router;
