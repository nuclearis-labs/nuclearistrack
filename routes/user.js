const express = require('express');
const { asyncMiddleware } = require('../middleware/index');
const { generateNewWallet } = require('../functions/wallet');
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

      const newWallet = generateNewWallet(req.body.newPassphrase);

      // const { wallet, privKey } = await getKeys(req.body);

      const nuclear = new NuclearPoE(
        '0xF691198C305eaDc10c2954202eA6b0BB38A76B43',
        'b79493c56182cffcb710c1e084be41b2c076a59fdff37ffa540e720f28f7e26f'
      );

      const { txHash } = await nuclear.createUser(
        newWallet.rskAddress,
        req.body.newUserName,
        req.body.userType
      );

      const result = await UserModel.create({
        username: req.body.newUserName,
        email: req.body.newUserEmail,
        address: newWallet.rskAddress,
        encryptedPrivateKey: newWallet.encryptedPrivKey
      });

      res.json({ result, txHash });
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

      const wallet = new Wallet(true);

      wallet.encryptedKey = user.encryptedPrivateKey;
      wallet
        .decryptBIP38(req.body.passphrase)
        .generatePublicKey()
        .generateRSKAddress();

      if (wallet.rskAddressFromPublicKey === user.address)
        res.json({ message: 'Estas logueado' });
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
      const walletGen = new Wallet(true);
      walletGen
        .generatePrivateKey()
        .generateWifPrivateKey()
        .generatePublicKey()
        .generateRSKAddress()
        .encryptBIP38(req.body.password)
        .toHex(['rskAddressFromPublicKey']);

      const wallet = '0x32871C4e31A72E340b991ebBF5F9AE30239a31Fc';
      const privKey =
        'ad48cd5d5f2b0d93f4e190fcdaed5c74c5ba48f1382e255b7ac816dd7946a9a8 ';

      const nuclear = new NuclearPoE(wallet, privKey);
      const contractAddress = await nuclear.createNewNuclearPoE('0x' + privKey);

      res.json({ contractAddress, wallet, privKey });
    } catch (e) {
      console.log(e);
      res.json({ error: e.message });
    }
  })
);

module.exports = router;
