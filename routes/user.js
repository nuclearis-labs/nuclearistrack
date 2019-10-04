const express = require('express');
const { asyncMiddleware } = require('../middleware/index');
const Wallet = require('../classes/Wallet');
const NuclearPoE = require('../classes/NuclearPoE');
const UserModel = require('../models/user');
const { getKeys } = require('../functions/utils');

const router = express.Router({ mergeParams: true });

router.post(
  '/',
  asyncMiddleware(async (req, res) => {
    try {
      const user = await UserModel.findOne({ email: req.body.email });

      if (user) {
        throw Error('A user with the given email is already registered');
      }

      const wallet = new Wallet(true);
      wallet
        .generatePrivateKey()
        .generateWifPrivateKey()
        .generatePublicKey()
        .generateRSKAddress()
        .encryptBIP38(req.body.passphrase)
        .toHex(['rskAddressFromPublicKey']);

      const result = await UserModel.create({
        username: req.body.clientName,
        email: req.body.email,
        address: wallet.rskAddressFromPublicKey,
        privateKey: wallet.privKey.toString('hex'),
        encryptedPrivateKey: wallet.encryptedKey
      });

      res.json({ result });
    } catch (e) {
      res.json({ error: e.message });
    }
  })
);

router.post(
  '/createNuclear',
  asyncMiddleware(async (req, res) => {
    try {
      const { wallet, privKey } = await getKeys(req.body);

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
