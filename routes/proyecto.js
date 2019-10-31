const express = require('express');
const Contract = require('../classes/Contract');
const web3 = require('web3');
const fs = require('fs');
const nuclearPoEABI = JSON.parse(
  fs.readFileSync('build/contracts/NuclearPoE.json')
).abi;
const { web3ArrayToJSArray } = require('../functions/utils');
const {
  getKeys,
  toChecksumAddress,
  isNumber,
  asciiToHex,
  hexToAscii,
  createPendingTx
} = require('../functions/utils');
const { verifyToken } = require('../middleware/index');
const txModel = require('../models/transaction');

const router = express.Router({ mergeParams: true });

router.post('/', async (req, res) => {
  try {
    const { wallet, privateKey } = await getKeys(req.body);
    const nuclear = new Contract({ privateKey });

    const expediente = isNumber(Number(req.body.expediente));
    const oc = asciiToHex(req.body.oc);
    const projectTitle = asciiToHex(req.body.proyectoTitle);
    const clientAddress = toChecksumAddress(req.body.clientAddress);
    console.log(clientAddress);

    const txHash = await nuclear.sendDataToContract({
      fromAddress: wallet,
      method: 'createProject',
      data: [expediente, clientAddress, projectTitle, oc]
    });

    await createPendingTx({
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

router.get('/getDocNumber', async (req, res) => {
  try {
    const contract = new Contract();
    const result = await contract.getDataFromContract({ method: 'docNumber' });

    res.json(result);
  } catch (e) {
    console.log(e);

    res.json({ error: e.message });
  }
});

router.get('/get', async (req, res) => {
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

      const [
        active,
        clientAddress,
        title,
        oc,
        processContracts
      ] = web3ArrayToJSArray(projectDetails);

      await txModel.findOneAndRemove({
        subject: 'add-project',
        data: { $in: allProjects[i] }
      });

      const userName = await contract.getDataFromContract({
        method: 'getUserDetails',
        data: [clientAddress]
      });

      response.push({
        title: hexToAscii(title),
        clientAddress,
        clientName: hexToAscii(userName[0]),
        expediente: allProjects[i],
        oc: hexToAscii(oc),
        processContracts
      });
    }

    const pendingTx = await txModel.find({ subject: 'add-project' });
    for (let y = 0; y < pendingTx.length; y++) {
      const userName = await contract.getDataFromContract({
        method: 'getUserDetails',
        data: [pendingTx[y].data[1]]
      });

      response.push({
        title: pendingTx[y].data[0],
        clientName: hexToAscii(userName[0]),
        clientAddress: pendingTx[y].data[1],
        expediente: pendingTx[y].data[2],
        tx: pendingTx[y].txHash,
        oc: pendingTx[y].data[3],
        status: 'pending'
      });
    }

    res.json(response);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e.message });
  }
});

router.get('/get/:expediente', async (req, res) => {
  try {
    const contract = new Contract();
    const result = await contract.getDataFromContract({
      method: 'getProjectDetails',
      data: [req.params.expediente]
    });

    console.log(result);

    const userName = await contract.getDataFromContract({
      method: 'getUserDetails',
      data: [result[1]]
    });

    res.json({
      active: result[0],
      clientName: hexToAscii(userName[0]),
      clientAddress: result[1],
      expediente: req.params.expediente,
      title: hexToAscii(result[2]),
      oc: hexToAscii(result[3]),
      processContracts: result[4]
    });
  } catch (e) {
    console.log(e);
    res.json({ error: e.message });
  }
});

router.post('/close/:expediente', async (req, res) => {
  try {
    const contract = new Contract();
    const txHash = await contract.getDataFromContract({
      method: 'closeProject',
      data: [req.params.expediente]
    });

    res.json(txHash);
  } catch (e) {
    console.log(e);
    res.json({ error: e.message });
  }
});

router.post('/assignProcess', async (req, res) => {
  try {
    const { wallet, privateKey } = await getKeys(req.body);
    const contract = new Contract({ privateKey });
    const txHash = await contract.sendDataToContract({
      fromAddress: wallet,
      method: 'addProcessToProject',
      data: [Number(req.body.expediente), req.body.processContract]
    });

    await createPendingTx({
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
