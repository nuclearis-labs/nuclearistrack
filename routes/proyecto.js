const express = require('express');

const Contract = require('../classes/Contract');
const utils = require('../functions/utils');
const { verifyToken } = require('../middleware/index');
const txModel = require('../models/transaction');
const niv = require('../services/Validator.js');

const router = express.Router({ mergeParams: true });

router.post('/', verifyToken, async (req, res) => {
  try {
    const v = new niv.Validator(req.body, {
      expediente: 'required|integer',
      proyectoTitle: 'required|ascii',
      clientAddress: 'required|checksumAddress',
      passphrase: 'required|ascii',
      email: 'required|email',
      oc: 'required|ascii'
    });

    const matched = await v.check();
    if (!matched) {
      res.status(422).send(v.errors);
    } else {
      const { address, privateKey } = await utils.getKeys(req.body);
      const nuclear = new Contract({ privateKey });

      const oc = utils.asciiToHex(req.body.oc);
      const projectTitle = utils.asciiToHex(req.body.proyectoTitle);

      const txHash = await nuclear.sendDataToContract({
        fromAddress: address,
        method: 'createProject',
        data: [req.body.expediente, req.body.clientAddress, projectTitle, oc]
      });

      await utils.createPendingTx({
        txHash,
        subject: 'add-project',
        data: [
          req.body.proyectoTitle,
          req.body.clientAddress,
          req.body.expediente,
          req.body.oc
        ]
      });

      res.json(txHash);
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e.message });
  }
});

router.get('/getDocNumber', verifyToken, async (req, res) => {
  try {
    const contract = new Contract();
    const result = await contract.getDataFromContract({ method: 'docNumber' });

    res.json(result);
  } catch (e) {
    console.log(e);
    res.json({ error: e.message });
  }
});

router.get('/get', verifyToken, async (req, res) => {
  try {
    const contract = new Contract();
    const contractProjects = await contract.getDataFromContract({
      method: 'getAllProjects'
    });

    await txModel.deleteMany({ data: { $in: contractProjects } });
    const pendingProjects = await txModel.aggregate([
      {
        $match: {
          subject: 'add-project'
        }
      },
      {
        $group: {
          _id: null,
          result: { $push: { $arrayElemAt: ['$data', 2] } }
        }
      }
    ]);

    const allProjects = Object.values(contractProjects).concat(
      pendingProjects.length > 0 ? pendingProjects[0]['result'] : []
    );

    const allProjectsDetails = allProjects.map(async id => {
      const details = await contract.getDataFromContract({
        method: 'getProjectDetails',
        data: [id]
      });
      if (
        details[1] === req.user.address ||
        req.user.address === process.env.ADMINADDRESS
      )
        return {
          status: details[0],
          clientAddress: details[1],
          clientName: utils.hexToAscii(details[2]),
          title: utils.hexToAscii(details[3]),
          oc: utils.hexToAscii(details[4]),
          processContracts: details[5],
          id
        };
      return {};
    });

    Promise.all(allProjectsDetails).then(projectDetails => {
      res.json(projectDetails);
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e.message });
  }
});

router.post('/close/:expediente', verifyToken, async (req, res) => {
  try {
    const v = new niv.Validator(
      { body: req.body, params: req.params },
      {
        'body.email': 'required|email',
        'body.passphrase': 'required|ascii',
        'params.expediente': 'required|integer'
      }
    );

    const matched = await v.check();
    if (!matched) {
      res.status(422).send(v.errors);
    } else {
      const { address, privateKey } = await utils.getKeys(req.body);

      const contract = new Contract({ privateKey });
      const txHash = await contract.sendDataToContract({
        fromAddress: address,
        method: 'changeProjectStatus',
        data: [req.params.expediente]
      });

      res.json(txHash);
    }
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/getOne', verifyToken, async (req, res) => {
  try {
    const v = new niv.Validator(req.query, {
      expediente: 'required|integer'
    });

    const matched = await v.check();
    if (!matched) {
      res.status(422).send(v.errors);
    } else {
      const contract = new Contract();
      const result = await contract.getDataFromContract({
        method: 'getProjectDetails',
        data: [req.query.expediente]
      });

      res.json({
        active: result[0],
        clientName: utils.hexToAscii(result[2]),
        clientAddress: result[1],
        expediente: req.query.expediente,
        title: utils.hexToAscii(result[3]),
        oc: utils.hexToAscii(result[4]),
        processContracts: result[5]
      });
    }
  } catch (e) {
    console.log(e);
    res.json({ error: e.message });
  }
});

router.post('/assignProcess', verifyToken, async (req, res) => {
  try {
    const v = new niv.Validator(req.body, {
      email: 'required|email',
      passphrase: 'required|ascii',
      expediente: 'required|integer',
      processContract: 'required|checksumAddress'
    });

    const matched = await v.check();
    if (!matched) {
      res.status(422).send(v.errors);
    } else {
      const { address, privateKey } = await utils.getKeys(req.body);
      const contract = new Contract({ privateKey });
      const txHash = await contract.sendDataToContract({
        fromAddress: address,
        method: 'addProcessToProject',
        data: [Number(req.body.expediente), req.body.processContract]
      });

      await utils.createPendingTx({
        txHash,
        subject: 'assign-process',
        data: [req.body.expediente, req.body.processContract]
      });

      res.json(txHash);
    }
  } catch (e) {
    console.log(e);
    res.json({ error: e.message });
  }
});

module.exports = router;
