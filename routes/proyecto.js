const express = require('express');
const NuclearPoE = require('../classes/NuclearPoE');
const Project = require('../classes/Project');
const Validator = require('../classes/Validator');
const { getKeys } = require('../functions/utils');

const router = express.Router({ mergeParams: true });

router.post('/', async (req, res) => {
  try {
    const { wallet, privKey } = await getKeys(req.body);
    const nuclear = new NuclearPoE(wallet, privKey);

    const response = await nuclear.addProject(
      Validator.checkAndConvertNumber(req.body.expediente),
      Validator.checkAndConvertString(req.body.proyectoTitle),
      Validator.checkAndConvertAddress(req.body.clientAddress)
    );

    res.json({ response });
  } catch (e) {
    console.log(e);

    res.json({ error: e.message });
  }
});

router.post('/approve/:contract', async (req, res) => {
  try {
    const { wallet, privKey } = await getKeys(req.body);

    const project = new Project(
      wallet,
      privKey,
      Validator.checkAndConvertAddress(req.params.contract)
    );

    const result = await project.approve();

    res.json({ result });
  } catch (e) {
    console.log(e);

    res.json({ error: e.message });
  }
});

router.post('/get', async (req, res) => {
  try {
    const { wallet, privKey } = await getKeys(req.body);
    const proyecto = new NuclearPoE(wallet, privKey);

    const result = await proyecto.returnAllProjects();

    res.json({ result });
  } catch (e) {
    res.json({ error: e.message });
  }
});

router.post('/details/:contract', async (req, res) => {
  try {
    const { wallet, privKey } = await getKeys(req.body);

    const project = new Project(wallet, privKey, req.params.contract);
    const result = await project.getDetails();

    // const result = await project.getDetails();

    res.json(result);
  } catch (e) {
    console.log(e);

    res.json({ error: e.message });
  }
});

module.exports = router;
