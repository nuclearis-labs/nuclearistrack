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

    const tx = await proyecto.sendTx();

    res.json({ tx });
  } catch (e) {
    res.json({ error: e.message });
  }
});

router.post('/approve', async (req, res) => {
  const proyecto = new Blockchain(req.body.wallet, req.body.privateKey);
  try {
    await proyecto.approveProject(req.body.contractAddress);
    const tx = await proyecto.sendTx(req.body.contractAddress);
    res.json({ tx });
  } catch (e) {
    res.json({ error: e.message });
  }
});

router.post('/get', async (req, res) => {
  const proyecto = new Blockchain(req.body.wallet, req.body.privateKey);
  try {
    const { projectos } = await proyecto.returnAllProjects();
    res.json({ projectos });
  } catch (e) {
    res.json({ error: e.message });
  }
});

router.post('/details', async (req, res) => {
  const proyecto = new Blockchain(req.body.wallet, req.body.privateKey);
  try {
    const result = await proyecto.contractDetails(req.body.contractAddress);

    res.json(result);
  } catch (e) {
    res.json({ error: e.message });
  }
});

module.exports = router;
