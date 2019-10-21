const express = require('express');
const NuclearPoE = require('../classes/NuclearPoE');
const Project = require('../classes/Project');
const Validator = require('../classes/Validator');
const web3 = require('web3');
const { convertResult } = require('../functions/utils');
const { getKeys } = require('../functions/utils');

const router = express.Router({ mergeParams: true });

router.post('/', async (req, res) => {
  try {
    const { wallet, privKey } = await getKeys(req.body);
    const nuclear = new NuclearPoE(wallet, privKey);

    const response = await nuclear.addProject(
      Validator.checkAndConvertNumber(req.body.expediente),
      Validator.checkAndConvertString(req.body.oc),
      Validator.checkAndConvertString(req.body.proyectoTitle),
      Validator.checkAndConvertAddress(req.body.clientAddress)
    );

    res.json({ response });
  } catch (e) {
    res.json({ error: e.message });
  }
});

router.post('/approve/:contract', async (req, res) => {
  try {
    const { wallet, privKey } = await getKeys(req.body);

    const project = new Project(wallet, privKey, req.params.contract);

    const result = await project.approve();

    res.json({ result });
  } catch (e) {
    console.log(e);

    res.json({ error: e.message });
  }
});

router.post('/getAll', async (req, res) => {
  try {
    const nuclear = new NuclearPoE();
    const returnAll = await nuclear.return('getAllProjectContract');
    const projectDetails = returnAll.map(async contractAddress => {
      const project = new Project(undefined, undefined, contractAddress);
      const result = await project.getDetails();

      const convertedResult = convertResult(result);
      const userName = await nuclear.return('getUserDetails', [
        convertedResult[1]
      ]);

      return [
        web3.utils.toAscii(convertedResult[0]),
        web3.utils.toAscii(userName[0]),
        convertedResult[2],
        web3.utils.toAscii(convertedResult[3]),
        convertedResult[7]
      ];
    });
    Promise.all(projectDetails).then(result => {
      res.json(result);
    });
  } catch (e) {
    console.log(e);

    res.json({ message: 'Here?', error: e.message });
  }
});

router.post('/get/:contract', async (req, res) => {
  try {
    const nuclear = new NuclearPoE();

    const project = new Project(undefined, undefined, req.params.contract);
    const resultRaw = await project.getDetails();

    const result = convertResult(resultRaw);

    const userName = await nuclear.return('getUserDetails', [result[1]]);

    res.json([
      web3.utils.toAscii(result[0]),
      web3.utils.toAscii(userName[0]),
      result[1],
      result[2],
      web3.utils.toAscii(result[3]),
      result[4],
      result[5],
      result[6],
      result[7]
    ]);
  } catch (e) {
    console.log(e);

    res.json({ error: e.message });
  }
});

module.exports = router;
