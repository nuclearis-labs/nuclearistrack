const express = require('express');
const NuclearPoE = require('../classes/NuclearPoE');
const Project = require('../classes/Project');
const { getKeys } = require('../functions/utils');

const router = express.Router({ mergeParams: true });

router.post('/', async (req, res) => {
  try {
    const { wallet, privKey } = await getKeys(req.body);

    const nuclear = new NuclearPoE(wallet, privKey);
    const response = await nuclear.addProject(
      parseInt(req.body.expediente, 10),
      req.body.proyectoTitle,
      req.body.clientAddress
    );
    res.json({ response });
  } catch (e) {
    res.json({ error: e.message });
  }
});

router.post('/approve/:contract', async (req, res) => {
  const { wallet, privKey } = await getKeys(req.body);
  console.log(wallet);
  console.log(privKey);

  const project = new Project(req.params.contract, wallet, privKey);
  try {
    const result = await project.approve();
    res.json({ result });
  } catch (e) {
    res.json({ error: e.message });
  }
});

router.post('/get', async (req, res) => {
  const { wallet, privKey } = await getKeys(req.body);

  const proyecto = new NuclearPoE(wallet, privKey);
  try {
    const result = await proyecto.returnAllProjects();
    res.json({ result });
  } catch (e) {
    res.json({ error: e.message });
  }
});

router.post('/details/:contract', async (req, res) => {
  const { wallet, privKey } = await getKeys(req.body);

  const project = new Project(req.params.contract, wallet, privKey);
  try {
    const result = await project.getDetails();

    res.json(result);
  } catch (e) {
    res.json({ error: e.message });
  }
});

module.exports = router;
