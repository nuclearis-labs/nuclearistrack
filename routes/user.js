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
const { getKeys, convertResult } = require('../functions/utils');
const User = require('../classes/User');

const router = express.Router({ mergeParams: true });

router.post(
  '/',
  asyncMiddleware(async (req, res) => {
    try {
      const user = await UserModel.findOne({ email: req.body.newUserEmail });

      if (user) {
        throw Error('A user with the given email is already registered');
      }

      const newPrivKey = generatePrivateKey();
      const newPublicKey = generatePublicKey(newPrivKey);
      const address = generateRSKAddress(newPublicKey);
      const encryptedKey = encryptBIP38(newPrivKey, req.body.newPassphrase);

      const { wallet, privKey } = await getKeys(req.body);

      const nuclear = new NuclearPoE(wallet, privKey);

      const txResult = await nuclear.createUser(address, req.body.newUserName);

      const result = await UserModel.create({
        username: req.body.newUserName,
        email: req.body.newUserEmail,
        address: address,
        encryptedPrivateKey: encryptedKey
      });

      res.json({ result, txResult: txResult });
    } catch (e) {
      console.log(e);

      res.json({ error: e.message });
    }
  })
);

router.post(
  '/validate',
  asyncMiddleware(async (req, res) => {
    try {
      const user = await UserModel.findOne({ email: req.body.email });

      if (!user) throw Error();

      const address = generateRSKAddress(
        generatePublicKey(
          decryptBIP38(user.encryptedPrivateKey, req.body.passphrase)
        )
      );

      if (address === user.address) res.json({ message: 'Estas logueado' });
      else throw Error();
    } catch (e) {
      res.json({ error: 'Usuario o contraseña incorrecta' });
    }
  })
);

router.post(
  '/change',
  asyncMiddleware(async (req, res) => {
    try {
      const client = await UserModel.findById('');

      const wallet = new Wallet(true);
      wallet
        .decryptBIP38(client.encryptedPrivateKey, req.body.passphrase)
        .encryptBIP38(req.body.newPassphrase);

      const updatedClient = await UserModel.findByIdAndUpdate('id', {
        encryptedPrivateKey: wallet.encryptedPrivateKey
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
    const result = await users.return('getAllUsers');
    response = [];
    for (let i = 0; i < result.length; i++) {
      const user = new User();
      let details = await user.getUserDetails(result[i]);
      let [nombre] = convertResult(details);

      let balance = await web3.eth.getBalance(result[i]);

      response[i] = [
        web3.utils.toAscii(nombre),
        result[i],
        web3.utils.fromWei(balance)
      ];
    }
    res.json(response);
  } catch (e) {
    console.log(e);

    res.json({ error: e.message });
  }
});

router.post('/get/:address', async (req, res) => {
  try {
    const user = new User();
    let result = await user.getUserDetails(req.params.address);
    result = convertResult(result);
    let response = [];
    for (let i = 0; i < result[1].length; i++) {
      let proyecto = new Project(undefined, undefined, result[1][i]);
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
      ] = convertResult(detailsResponse);
      response.push([
        web3.utils.toAscii(title),
        expediente,
        web3.utils.toAscii(oc),
        contrato
      ]);
    }

    res.json({
      userName: web3.utils.toAscii(result[0]),
      proyectos: response
    });
  } catch (e) {
    console.log(e);

    res.json({ error: e.message });
  }
});

module.exports = router;
