const express = require('express');
const web3 = require('../services/web3');
const { asyncMiddleware } = require('../middleware/index');
const {
  generatePrivateKey,
  generatePublicKey,
  generateRSKAddress,
  encryptBIP38,
  decryptBIP38
} = require('../functions/wallet');
const NuclearPoE = require('../classes/NuclearPoE');
const Project = require('../classes/Project');
const UserModel = require('../models/user');
const txModel = require('../models/transaction');
const {
  getKeys,
  web3ArrayToJSArray,
  isEmail,
  toChecksumAddress,
  isNumber,
  asciiToHex,
  isString
} = require('../functions/utils');
const User = require('../classes/User');

const router = express.Router({ mergeParams: true });

router.post(
  '/',
  asyncMiddleware(async (req, res) => {
    try {
      const newUsername = asciiToHex(req.body.newUserName);
      const newUserEmail = isEmail(req.body.newUserEmail);
      const userType = isNumber(Number(req.body.userType));
      const newPassphrase = isString(req.body.newPassphrase);
      const email = isEmail(req.body.email);
      const passphrase = isString(req.body.passphrase);

      const user = await UserModel.findOne({ newUserEmail });

      if (user) {
        throw Error('A user with the given email is already registered');
      }

      const newPrivKey = generatePrivateKey();
      const newPublicKey = generatePublicKey(newPrivKey);
      const address = generateRSKAddress(newPublicKey);
      const encryptedPrivateKey = encryptBIP38(newPrivKey, newPassphrase);

      const { wallet, privKey } = await getKeys({ email, passphrase });

      const nuclear = new NuclearPoE(wallet, privKey);
      const txHash = await nuclear.createUser(address, userType, newUsername);

      await txModel.create({
        hash: txHash,
        proyecto: nuclear.instance.options.address,
        subject: 'add-user',
        data: [req.body.newUserName, address]
      });

      const db = await UserModel.create({
        username: req.body.newUserName,
        email: newUserEmail,
        address,
        encryptedPrivateKey
      });

      res.json({
        username: db.username,
        email: db.email,
        address: db.address,
        txHash
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e.message });
    }
  })
);

router.post(
  '/change',
  asyncMiddleware(async (req, res) => {
    try {
      const passphrase = isString(req.body.passphrase);
      const newPassphrase = isString(req.body.newPassphrase);
      const email = isEmail(req.body.email);

      const user = await UserModel.findOne({ email: email });

      const decryptedKey = decryptBIP38(user.encryptedPrivateKey, passphrase);
      const encryptedPrivateKey = encryptBIP38(decryptedKey, newPassphrase);

      const updatedClient = await UserModel.findByIdAndUpdate(user._id, {
        encryptedPrivateKey
      });

      res.json(updatedClient);
    } catch (e) {
      res.json({ error: e.message });
    }
  })
);

router.post('/getAll', async (req, res) => {
  try {
    const users = new NuclearPoE();
    const allUsers = await users.return('getAllUsers');
    response = [];

    for (let i = 0; i < allUsers.length; i++) {
      await txModel.findOneAndRemove({
        subject: 'add-user',
        data: { $in: allUsers[i] }
      });
      const user = new User();
      const details = await user.getUserDetails(allUsers[i]);

      let [nombre, userType] = web3ArrayToJSArray(details);
      const balance = await web3.eth.getBalance(allUsers[i]);

      response[i] = [
        web3.utils.toAscii(nombre),
        allUsers[i],
        userType,
        web3.utils.fromWei(balance)
      ];
    }
    const pendingTx = await txModel.find({ subject: 'add-user' });
    for (let y = 0; y < pendingTx.length; y++) {
      response.push([
        pendingTx[y].data[0],
        pendingTx[y].hash,
        '',
        '0',
        'pending'
      ]);
    }

    res.json(response);
  } catch (e) {
    res.json({ error: e.message });
  }
});

router.get('/getBalance/:address', (req, res) => {
  web3.eth.getBalance(req.params.address).then(balance => {
    res.json(web3.utils.fromWei(balance));
  });
});

router.post('/get/:address', async (req, res) => {
  try {
    const address = toChecksumAddress(req.params.address);
    const user = new User();
    const result = await user.getUserDetails(address);
    const [userName, userType, userProjects] = web3ArrayToJSArray(result);
    let response = [];
    let balance = await web3.eth.getBalance(address);
    for (let i = 0; i < userProjects.length; i++) {
      let proyecto = new Project(undefined, undefined, userProjects[i]);
      let detailsResponse = await proyecto.getDetails();
      let [
        title,
        client,
        expediente,
        oc,
        approved,
        documents,
        suppliers,
        contrato
      ] = web3ArrayToJSArray(detailsResponse);
      response.push([
        web3.utils.toAscii(title),
        expediente,
        web3.utils.toAscii(oc),
        contrato
      ]);
    }

    res.json({
      userName: web3.utils.toAscii(result[0]),
      balance: web3.utils.fromWei(balance),
      proyectos: response
    });
  } catch (e) {
    console.log(e);

    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
