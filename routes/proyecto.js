const express = require('express');
const Blockchain = require('../classes/Blockchain');

const router = express.Router({ mergeParams: true });

router.post('/', async (req, res) => {
  const proyecto = new Blockchain(req.body.wallet, req.body.privateKey);
  try {
    await proyecto.addProject(
      Number(req.body.expediente),
      req.body.proyectoTitle.toString(),
      req.body.clientAddress.toString(),
      req.body.clientName.toString()
    );

    let tx = await proyecto.sendTx();

    res.json({ tx });
  } catch (e) {
    res.json({ error: e.message });
  }
});

router.post('/approve', async (req, res) => {
  const proyecto = new Blockchain(req.body.wallet, req.body.privateKey);
  try {
    let { projectContractAddress } = await proyecto.approveProject(
      Number(req.body.expediente)
    );

    const tx = await proyecto.sendTx(projectContractAddress);
    res.json({ tx });
  } catch (e) {
    res.json({ error: e.message });
  }
});

router.post('/documents', async (req, res) => {
  const proyecto = new Blockchain(req.body.wallet, req.body.privateKey);
  try {
    let { documents, projectContractAddress } = await proyecto.returnDocuments(
      Number(req.body.expediente)
    );
    res.json({ projectContractAddress, documents });
  } catch (e) {
    res.json({ error: e.message });
  }
});

router.post('/details', async (req, res) => {
  const proyecto = new Blockchain(req.body.wallet, req.body.privateKey);
  try {
    let { contractDetails } = await proyecto.contractDetails(
      Number(req.body.expediente)
    );

    res.json({ contractDetails });
  } catch (e) {
    res.json({ error: e.message });
  }
});

module.exports = router;
