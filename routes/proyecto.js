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

    let tx = await proyecto.sendTx(process.env.SCADDRESS);

    res.json({ message: `Project created`, data: tx });
  } catch (e) {
    res.json({ error: e.message });
  }
});

router.post('/approve', async (req, res) => {
  const proyecto = new Blockchain(req.body.wallet, req.body.privateKey);
  try {
    await proyecto.approveProject(Number(req.body.expediente));
    const tx = await proyecto.sendTx(
      '0x42fc91b283e6d29e650ad810040c93184053e1ec'
    );
    res.json({ message: `Project approved`, data: tx });
  } catch (e) {
    res.json({ error: e.message });
  }
});

router.post('/details', async (req, res) => {
  const proyecto = new Blockchain(req.body.wallet, req.body.privateKey);
  try {
    let data = await proyecto.contractDetails(Number(req.body.expediente));

    res.json({ message: `Got project details`, data: data });
  } catch (e) {
    res.json({ error: e.message });
  }
});

module.exports = router;
