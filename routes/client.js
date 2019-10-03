const express = require('express');
const { asyncMiddleware } = require('../middleware/index');
const Wallet = require('../classes/Wallet');
const NuclearPoE = require('../classes/NuclearPoE');
const Client = require('../classes/Client');
const Validator = require('../classes/Validator');
const { getKeys } = require('../functions/utils');

const router = express.Router({ mergeParams: true });

router.post(
  '/',
  asyncMiddleware(async (req, res) => {
    try {
      const user = await ClientModel.findOne({ email: req.body.newEmail });

      if (user) {
        throw Error('A user with the given email is already registered');
      }

      const walletGen = new Wallet(true);
      walletGen
        .generatePrivateKey()
        .generateWifPrivateKey()
        .generatePublicKey()
        .generateRSKAddress()
        .encryptBIP38(req.body.newPassphrase)
        .toHex(['rskAddressFromPublicKey']);

      const email = req.body.newEmail;
      const passphrase = req.body.passphrase;
      const { wallet, privKey } = await getKeys(email, passphrase);
      const nuclear = new NuclearPoE(wallet, privKey);

      const tx = await nuclear.createThirdParty(
        Validator.checkAndConvertAddress(walletGen.rskAddressFromPublicKey),
        Validator.checkAndConvertString(req.body.clientName),
        'createClient'
      );

      // Create DB record and hash password
      const result = await ClientModel.create({
        username: req.body.clientName,
        email: req.body.newEmail,
        address: walletGen.rskAddressFromPublicKey,
        contract: tx.contractAddress,
        encryptedPrivateKey: walletGen.encryptedKey
      });

      res.json({ result });
    } catch (e) {
      res.json({ error: e.message });
    }
  })
);

router.post(
  '/validate',
  asyncMiddleware(async (req, res) => {
    try {
      const user = await ClientModel.findOne({ email: req.body.email });

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
      const client = await ClientModel.findById('');

      const wallet = new Wallet(true);
      wallet
        .decryptBIP38(client.encryptedPrivateKey, req.body.passphrase)
        .encryptBIP38(req.body.newPassphrase);

      const updatedClient = await ClientModel.findByIdAndUpdate('id', {
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
    const client = new Client(
      req.params.contract,
      req.body.wallet,
      req.body.privateKey
    );

    const result = await client.getClientDetails();
    res.json({ result });
  } catch (e) {
    res.json({ error: e.message });
  }
});

module.exports = router;
