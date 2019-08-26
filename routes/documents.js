const express = require('express');
const storage = require('multer').memoryStorage();
const upload = require('multer')({ storage });
const { asyncMiddleware } = require('../middleware/index');
const Documento = require('../classes/Documento');

const router = express.Router({ mergeParams: true });

router.get('/upload', (req, res) => {
  res.json({ message: 'Upload Form' });
});

router.get('/verify', (req, res) => {
  res.json({ message: 'Verify Form' });
});

router.get('/list/', (req, res) => {
  res.json({ message: 'Show items' });
});

router.post(
  '/upload',
  upload.single('file'),
  asyncMiddleware(async (req, res) => {
    const file = new Documento(req.body.keys);
    await file.createHash(req.file);

    await file.addDocHash(
      req.body.expediente,
      req.body.documentTitle,
      req.body.IPFSHash
    );
    await file.sendTx();

    res.json({ message: 'Transaction successful', data: file });
  })
);

router.post(
  '/verify',
  upload.single('file'),
  asyncMiddleware(async (req, res) => {
    const file = await new Documento(req.file).createHash().findBlock();

    if (file.foundBlock.blockNumber === '0') {
      res.json({ message: 'Not found', data: file });
    } else {
      res.json({ message: 'Hash found', data: file });
    }
  })
);

module.exports = router;
