const express = require('express');
const { asyncMiddleware } = require('../middleware/index');
const Wallet = require('../classes/Wallet');
const NuclearPoE = require('../classes/NuclearPoE');
const Supplier = require('../classes/Supplier');
const SupplierModel = require('../models/supplier');
const { getKeys } = require('../functions/utils');

const router = express.Router({ mergeParams: true });

router.post(
  '/',
  asyncMiddleware(async (req, res) => {
    try {
      const { wallet, privKey } = await getKeys(req.body);

      const walletGen = new Wallet(true);
      walletGen
        .generatePrivateKey()
        .generateWifPrivateKey()
        .generatePublicKey()
        .generateRSKAddress()
        .encryptBIP38(req.body.passphrase)
        .toHex(['rskAddressFromPublicKey']);

      const nuclear = new NuclearPoE(wallet, privKey);
      const tx = await nuclear.createThirdParty(
        walletGen.rskAddressFromPublicKey,
        req.body.clientName,
        'createSupplier'
      );

      // Create DB record and hash password
      const result = await SupplierModel.create({
        username: req.body.clientName,
        email: req.body.email,
        contract: tx.contractAddress,
        address: walletGen.rskAddressFromPublicKey,
        encryptedPrivateKey: walletGen.wifPrivKey
      });

      res.json({ result });
    } catch (e) {
      res.json({ error: e.message });
    }
  })
);

router.post('/get/:contract', async (req, res) => {
  try {
    const supplier = new Supplier(
      req.params.contract,
      req.body.wallet,
      req.body.privateKey
    );

    const result = await supplier.getSupplierDetails();
    res.json({ result });
  } catch (e) {
    res.json({ error: e.message });
  }
});

module.exports = router;
