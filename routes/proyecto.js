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
    const email = req.body.newEmail;
    const passphrase = req.body.passphrase;
    const { wallet, privKey } = await getKeys(email, passphrase);

    const contractAddress = Validator.checkAndConvertAddress(
      req.params.contract
    );

    const project = new Project(wallet, privKey);
    project.initiateContract(contractAddress);

    const result = await project.approve();

    res.json({ result });
  } catch (e) {
    console.log(e);

    res.json({ error: e.message });
  }
});

router.post('/get', async (req, res) => {
  try {
    const email = req.body.newEmail;
    const passphrase = req.body.passphrase;

    const { wallet, privKey } = await getKeys(email, passphrase);

    const proyecto = new NuclearPoE(wallet, privKey);
    nuclear.initiateContract();

    const result = await proyecto.returnAllProjects();

    res.json({ result });
  } catch (e) {
    res.json({ error: e.message });
  }
});

router.post('/details/:contract', async (req, res) => {
  try {
    const email = req.body.newEmail;
    const passphrase = req.body.passphrase;
    const { wallet, privKey } = await getKeys(email, passphrase);

    const project = new Project(wallet, privKey);
    project.initiateContract(req.params.contract);

    const result = await project.getDetails();

    res.json(result);
  } catch (e) {
    res.json({ error: e.message });
  }
});

module.exports = router;
