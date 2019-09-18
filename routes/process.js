const express = require('express');
const Blockchain = require('../classes/Blockchain');
const router = express.Router({ mergeParams: true });

router.post('/', async (req, res) => {
  let process = new Blockchain(req.body.wallet, req.body.privateKey);
  try {
    // FALTA VALIDACIÓN DE DATOS PARA AGREGAR PROCESO
    await process.addProcess(
      req.body.contractAddress,
      req.body.supplierAddress,
      req.body.processTitle,
      req.body.supplierName
    );

    // ATENCIÓN: TOMA DIRECCIÓN DE CONTRATO DE LOS PARAMETROS POST...
    // FALTA VALIDACIÓN
    let tx = await process.sendTx(req.body.contractAddress);
    res.json({ tx });
  } catch (e) {
    res.json({ error: e.message });
  }
});

router.post('/get', async (req, res) => {
  let process = new Blockchain(req.body.wallet, req.body.privateKey);
  try {
    let { processList, projectContractAddress } = await process.getProcess(
      req.body.contractAddress
    );
    res.json({ processList, projectContractAddress });
  } catch (e) {
    res.json({ error: e.message });
  }
});

module.exports = router;
