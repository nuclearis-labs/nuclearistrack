const express = require('express');
const Transaction = require('../classes/Transaction');
const { verifyToken } = require('../middleware/index');
const { getKeys } = require('../functions/utils');
const niv = require('../services/Validator');

const router = express.Router({ mergeParams: true });

router.post('/', verifyToken, async (req, res) => {
  try {
    const v = new niv.Validator(req.body, {
      email: 'required|email',
      passphrase: 'required|ascii',
      to: 'required',
      value: `required|integer|sufficientFunds:${req.body.to}`
    });

    const matched = await v.check();
    if (!matched) {
      res.status(422).send(v.errors);
    } else {
      const { address, privateKey } = await getKeys({
        email: req.body.email,
        passphrase: req.body.passphrase,
        coin: process.env.DEVIATIONCOIN
      });

      const tx = new Transaction({ fromAddress: address });
      await tx.estimateGas();
      await tx.getNonce();
      tx.prepareRawTx({
        value: req.body.value,
        to: req.body.to,
        gaslimit: 4000000
      })
        .sign(Buffer.from(privateKey, 'hex'))
        .serialize();

      const txHash = await tx.send();

      res.json({ txHash });
    }
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
