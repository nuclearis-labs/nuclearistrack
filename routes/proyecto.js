const express = require('express');

const Contract = require('../classes/Contract');
const utils = require('../functions/utils');
const { verifyToken } = require('../middleware/index');
const txModel = require('../models/transaction');

const router = express.Router({ mergeParams: true });

router.post('/', verifyToken, async (req, res) => {
  try {
    const { address, privateKey } = await utils.getKeys(req.body);
    const nuclear = new Contract({ privateKey });

    const expediente = utils.isNumber(Number(req.body.expediente));
    const oc = utils.asciiToHex(req.body.oc);
    const projectTitle = utils.asciiToHex(req.body.proyectoTitle);
    const clientAddress = utils.toChecksumAddress(req.body.clientAddress);

    const txHash = await nuclear.sendDataToContract({
      fromAddress: address,
      method: 'createProject',
      data: [expediente, clientAddress, projectTitle, oc]
    });

    await utils.createPendingTx({
      txHash,
      subject: 'add-project',
      data: [req.body.proyectoTitle, clientAddress, expediente, req.body.oc]
    });

    res.json(txHash);
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
    const allProjects = await contract.getDataFromContract({
      method: 'getAllProjects'
    });

    response = [];
    for (let i = 0; i < allProjects.length; i++) {
      const projectDetails = await contract.getDataFromContract({
        method: 'getProjectDetails',
        data: [allProjects[i]]
      });

      await txModel.findOneAndRemove({
        subject: 'add-project',
        data: { $in: allProjects[i] }
      });

      const userName = await contract.getDataFromContract({
        method: 'getUserDetails',
        data: [projectDetails[1]]
      });

      if (
        projectDetails[1] === req.user.address ||
        req.user.address === process.env.ADMINADDRESS
      ) {
        response.push({
          title: utils.hexToAscii(projectDetails[2]),
          clientAddress: projectDetails[1],
          clientName: utils.hexToAscii(userName[0]),
          expediente: allProjects[i],
          oc: utils.hexToAscii(projectDetails[3])
        });
      }
    }

    const pendingTx = await txModel.find({ subject: 'add-project' });
    for (let y = 0; y < pendingTx.length; y++) {
      const userName = await contract.getDataFromContract({
        method: 'getUserDetails',
        data: [pendingTx[y].data[1]]
      });

      if (
        pendingTx[y].data[1] === req.user.address ||
        pendingTx[y].data[1] === process.env.ADMINADDRESS
      ) {
        response.push({
          title: pendingTx[y].data[0],
          clientName: utils.hexToAscii(userName[0]),
          clientAddress: pendingTx[y].data[1],
          expediente: pendingTx[y].data[2],
          tx: pendingTx[y].txHash,
          oc: pendingTx[y].data[3],
          status: 'pending'
        });
      }
    }

    res.json(response);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e.message });
  }
});

router.post('/close/:expediente', verifyToken, async (req, res) => {
  try {
    const { address, privateKey } = await utils.getKeys(req.body);

    const contract = new Contract({ privateKey });
    const txHash = await contract.sendDataToContract({
      fromAddress: address,
      method: 'changeProjectStatus',
      data: [req.params.expediente]
    });

    res.json(txHash);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/getOne', verifyToken, async (req, res) => {
  try {
    const contract = new Contract();
    const result = await contract.getDataFromContract({
      method: 'getProjectDetails',
      data: [req.query.expediente]
    });

    const userName = await contract.getDataFromContract({
      method: 'getUserDetails',
      data: [result[1]]
    });

    res.json({
      active: result[0],
      clientName: utils.hexToAscii(userName[0]),
      clientAddress: result[1],
      expediente: req.query.expediente,
      title: utils.hexToAscii(result[2]),
      oc: utils.hexToAscii(result[3]),
      processContracts: result[4]
    });
  } catch (e) {
    console.log(e);
    res.json({ error: e.message });
  }
});

router.post('/close', verifyToken, async (req, res) => {
  try {
    const { address, privateKey } = await utils.getKeys(req.body);

    const contract = new Contract({ privateKey });
    const txHash = await contract.sendDataToContract({
      fromAddress: address,
      method: 'closeProject',
      data: [Number(req.query.expediente)]
    });

    res.json(txHash);
  } catch (e) {
    console.log(e);
    res.json({ error: e.message });
  }
});

router.post('/assignProcess', verifyToken, async (req, res) => {
  try {
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
  } catch (e) {
    console.log(e);
    res.json({ error: e.message });
  }
});

module.exports = router;
