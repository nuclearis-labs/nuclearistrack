const express = require('express');
const { asyncMiddleware } = require('../middleware/index');
const Wallet = require('../classes/Wallet');
const NuclearPoE = require('../classes/NuclearPoE');
const SupplierModel = require('../models/supplier');

const router = express.Router({ mergeParams: true });

router.post(
  '/',
  asyncMiddleware(async (req, res) => {
    try {
      const wallet = new Wallet(true);

      // Generation of encrypted privatekey and address
      wallet
        .generateWifPrivateKey()
        .generatePublicKey()
        .generateRSKAddress()
        .encryptBIP38(req.body.passphrase)
        .toHex(['rskAddressFromPublicKey']);

      const nuclear = new NuclearPoE(req.body.wallet, req.body.privateKey);
      const tx = await nuclear.createThirdParty(
        wallet.rskAddressFromPublicKey,
        req.body.clientName,
        'createSupplier',
        'CreateSupplier'
      );

      // Create DB record and hash password
      const result = await SupplierModel.register(
        new SupplierModel({
          username: req.body.clientName,
          email: req.body.email,
          contract: tx.contractAddress,
          address: wallet.rskAddressFromPublicKey,
          encryptedPrivateKey: wallet.wifPrivKey
        }),
        req.body.password
      );

      res.json({ result });
    } catch (e) {
      res.json({ error: e.message });
    }
  })
);

module.exports = router;
