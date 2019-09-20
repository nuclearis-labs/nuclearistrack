const express = require('express');
const storage = require('multer').memoryStorage();
const upload = require('multer')({ storage });
const { asyncMiddleware } = require('../middleware/index');
const Documento = require('../classes/Documento');
const Blockchain = require('../classes/Blockchain');

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
    const file = new Documento(req.file, req.body.wallet, req.body.privateKey);
    await file.createHash(req.file);

    await file.addDocument(
      req.body.contractAddress,
      req.body.supplier,
      req.body.documentTitle
    );
    const tx = await file.sendTx(req.body.contractAddress);

    res.json({
      documentHash: file.documentHash,
      transaction: tx
    });
  })
);

router.post(
  '/verify',
  upload.single('file'),
  asyncMiddleware(async (req, res) => {
    const file = await new Documento(
      req.file,
      req.body.wallet,
      req.body.privateKey
    )
      .createHash(req.file)
      .findDocument(req.body.contractAddress);

    res.json({
      documentHash: file.documentHash,
      documentDetail: file.document
    });
  })
);

router.post('/get', async (req, res) => {
  const proyecto = new Blockchain(req.body.wallet, req.body.privateKey);
  try {
    const {
      documents,
      projectContractAddress
    } = await proyecto.returnDocuments(req.body.contractAddress);
    res.json({ projectContractAddress, documents });
  } catch (e) {
    res.json({ error: e.message });
  }
});

module.exports = router;
