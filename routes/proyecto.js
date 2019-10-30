const express = require('express');
const NuclearPoE = require('../classes/NuclearPoE');
const Project = require('../classes/Project');
const web3 = require('web3');
const { web3ArrayToJSArray } = require('../functions/utils');
const {
  getKeys,
  toChecksumAddress,
  isNumber,
  asciiToHex,
  hexToAscii
} = require('../functions/utils');
const { verifyToken } = require('../middleware/index');
const txModel = require('../models/transaction');

const router = express.Router({ mergeParams: true });

router.post('/', async (req, res) => {
  try {
    const { wallet, privKey } = await getKeys(req.body);
    const nuclear = new NuclearPoE(wallet, privKey);

    const expediente = isNumber(Number(req.body.expediente));
    const oc = asciiToHex(req.body.oc);
    const projectTitle = asciiToHex(req.body.proyectoTitle);
    const clientAddress = toChecksumAddress(req.body.clientAddress);

    const txHash = await nuclear.addProject({
      expediente,
      oc,
      projectTitle,
      clientAddress
    });

    await txModel.create({
      hash: txHash,
      proyecto: nuclear.address,
      subject: 'add-project',
      data: [req.body.proyectoTitle, clientAddress, expediente, req.body.oc]
    });

    res.json(txHash);
  } catch (e) {
    console.log(e);

    res.status(500).json({ error: e.message });
  }
});

router.post('/approve/:contract', async (req, res) => {
  try {
    const { wallet, privKey } = await getKeys(req.body);

    const project = new Project(wallet, privKey, req.params.contract);

    const txHash = await project.approve();

    await txModel.create({
      hash: txHash,
      proyecto: req.params.contract,
      subject: 'approve-project',
      data: []
    });

    res.json(txHash);
  } catch (e) {
    console.log(e);

    res.json({ error: e.message });
  }
});

router.get('/docNumber', async (req, res) => {
  try {
    const project = new NuclearPoE();

    const result = await project.return('docNumber', []);

    res.json(result);
  } catch (e) {
    console.log(e);

    res.json({ error: e.message });
  }
});

router.post('/getAll', async (req, res) => {
  try {
    const nuclear = new NuclearPoE();
    const allProjectContracts = await nuclear.return('getAllProjectContract');
    response = [];

    for (let i = 0; i < allProjectContracts.length; i++) {
      const project = new Project(undefined, undefined, allProjectContracts[i]);
      const projectContractDetails = await project.getDetails();
      const [
        title,
        clientAddress,
        expediente,
        oc,
        approved,
        allDocuments,
        supplierAddresses,
        contractAddress
      ] = web3ArrayToJSArray(projectContractDetails);

      await txModel.findOneAndRemove({
        subject: 'add-project',
        data: { $in: expediente }
      });

      const userName = await nuclear.return('getUserDetails', [clientAddress]);

      response.push([
        hexToAscii(title),
        hexToAscii(userName[0]),
        expediente,
        hexToAscii(oc),
        contractAddress,
        clientAddress
      ]);
    }

    const pendingTx = await txModel.find({ subject: 'add-project' });
    for (let y = 0; y < pendingTx.length; y++) {
      const userName = await nuclear.return('getUserDetails', [
        pendingTx[y].data[1]
      ]);

      response.push([
        pendingTx[y].data[0],
        hexToAscii(userName[0]),
        pendingTx[y].data[2],
        pendingTx[y].data[3],
        pendingTx[y].hash,
        pendingTx[y].data[1],
        'pending'
      ]);
    }

    res.json(response);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e.message });
  }
});

router.post('/get/:contract', async (req, res) => {
  try {
    const nuclear = new NuclearPoE();

    const project = new Project(undefined, undefined, req.params.contract);
    const resultRaw = await project.getDetails();

    const result = web3ArrayToJSArray(resultRaw);

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
