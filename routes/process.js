const express = require('express');
const Blockchain = require('../classes/Blockchain');

const router = express.Router({ mergeParams: true });

router.post('/', async (req, res) => {
  const proyecto = new Blockchain(req.body.keys);
  try {
    await proyecto.addProject(
      Number(req.body.expediente),
      req.body.proyectoTitle.toString(),
      req.body.clientAddress.toString(),
      req.body.clientName.toString()
    );
    const tx = await proyecto.sendTx();
    res.json({ message: `Project created`, data: tx });
  } catch (e) {
    res.json({ error: e.message });
  }
});

router.post('/approve', async (req, res) => {
  const proyecto = new Blockchain(req.body.keys);
  try {
    await proyecto.approveProject(Number(req.body.expediente));
    const tx = await proyecto.sendTx();
    res.json({ message: `Project approved`, data: tx });
  } catch (e) {
    res.json({ error: e.message });
  }
});

module.exports = router;
