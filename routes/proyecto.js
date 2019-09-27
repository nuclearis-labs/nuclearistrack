const express = require('express');
const NuclearPoE = require('../classes/NuclearPoE');
const Project = require('../classes/Project');

const router = express.Router({ mergeParams: true });

router.post('/', async (req, res) => {
  const nuclear = new NuclearPoE(req.body.wallet, req.body.privateKey);
  try {
    const response = await nuclear.addProject(
      parseInt(req.body.expediente, 10),
      req.body.proyectoTitle,
      req.body.clientAddress
    );
    res.json({ result: response });
  } catch (e) {
    res.json({ error: e.message });
  }
});

router.post('/approve/:contract', async (req, res) => {
  const project = new Project(
    req.params.contract,
    req.body.wallet,
    req.body.privateKey
  );
  try {
    const result = await project.approve();
    res.json({ result });
  } catch (e) {
    res.json({ error: e.message });
  }
});

router.post('/get', async (req, res) => {
  const proyecto = new NuclearPoE(req.body.wallet, req.body.privateKey);
  try {
    const { projectos } = await proyecto.returnAllProjects();
    res.json({ result: projectos });
  } catch (e) {
    res.json({ error: e.message });
  }
});

router.post('/details/:contract', async (req, res) => {
  const project = new Project(
    req.params.contract,
    req.body.wallet,
    req.body.privateKey
  );
  try {
    const result = await project.getDetails();

    res.json(result);
  } catch (e) {
    res.json({ error: e.message });
  }
});

module.exports = router;
