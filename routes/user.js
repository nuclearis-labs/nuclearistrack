const express = require('express');
const { asyncMiddleware } = require('../middleware/index');
const {
  generatePrivateKey,
  generatePublicKey,
  generateRSKAddress,
  encryptBIP38,
  decryptBIP38
} = require('../functions/wallet');
const NuclearPoE = require('../classes/NuclearPoE');
const UserModel = require('../models/user');
const { getKeys } = require('../functions/utils');
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
    const { wallet, privKey } = await getKeys(req.body);
    const users = new NuclearPoE(wallet, privKey);

    const result = await users.returnAll('getAllUsers');

    res.json({ result });
  } catch (e) {
    console.log(e);

    res.json({ error: e.message });
  }
});

router.post('/get/:contract', async (req, res) => {
  try {
    const { wallet, privKey } = await getKeys(req.body);

    const user = new User(wallet, privKey, req.params.contract);

    const result = await user.getUserDetails();
    res.json({ result });
  } catch (e) {
    console.log(e);

    res.json({ error: e.message });
  }
});

router.post(
  '/createNuclear',
  asyncMiddleware(async (req, res) => {
    try {
      //const { wallet, privKey } = await getKeys(req.body);

      const address = '0xF691198C305eaDc10c2954202eA6b0BB38A76B43';
      const privKey =
        'b79493c56182cffcb710c1e084be41b2c076a59fdff37ffa540e720f28f7e26f';

      const nuclear = new NuclearPoE(address, privKey);
      const contractAddress = await nuclear.createNewNuclearPoE('0x' + privKey);

      const user = await nuclear.createUser(address, 'NUCLEARIS', 2);

      res.json(contractAddress, privKey, user);
    } catch (e) {
      console.log(e);
      res.json({ error: e.message });
    }
  })
);

module.exports = router;
