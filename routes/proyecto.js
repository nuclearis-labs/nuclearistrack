const express = require('express');
const Contract = require('../classes/Contract');
const web3 = require('web3');
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

    const txHash = await nuclear.sendDataToContract({
      fromAddress: wallet,
      method: 'createProject',
      data: [expediente, oc, projectTitle, clientAddress]
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

router.get('/docNumber', async (req, res) => {
  try {
    const contract = new Contract();
    const result = await contract.getDataFromContract({ method: 'docNumber' });

    res.json(result);
  } catch (e) {
    console.log(e);

    res.json({ error: e.message });
  }
});

router.post('/getAll', async (req, res) => {
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
        title,
        clientAddress,
        expediente,
        oc,
        approved,
        allDocuments,
        supplierAddresses,
        contractAddress
      ] = web3ArrayToJSArray(projectDetails);

      await txModel.findOneAndRemove({
        subject: 'add-project',
        data: { $in: expediente }
      });

      const userName = await contract.getDataFromContract({
        method: 'getUserDetails',
        data: [clientAddress]
      });

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
      const userName = await contract.getDataFromContract({
        method: 'getUserDetails',
        data: [pendingTx[y].data[1]]
      });

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
