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
    let txResult = await proyecto.sendTx();
    console.log(txResult);

    res.json({ message: `Project created`, data: txResult });
  } catch (e) {
    res.json({ error: e.message });
  }
});

router.post('/approve', async (req, res) => {
  const proyecto = new Blockchain(req.body.wallet, req.body.privateKey);
  try {
    await proyecto.approveProject(Number(req.body.expediente));
    const tx = await proyecto.sendTx();
    res.json({ message: `Project approved`, data: result });
  } catch (e) {
    res.json({ error: e.message });
  }
});

module.exports = router;
