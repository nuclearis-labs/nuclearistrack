const express = require('express');
const Transaction = require('../classes/Transaction');
const router = express.Router({ mergeParams: true });
const { getKeys } = require('../functions/utils');

router.post('/to/:to/:value', async (req, res) => {
  const { wallet, privKey } = await getKeys(req.body);

  const tx = new Transaction(req.params.to, wallet);
  await tx.estimateGas();
  await tx.getNonce();
  tx.prepareRawTx(req.params.value, req.params.to, 4000000)
    .sign(privKey)
    .serialize();

  const hash = await tx.send();

  res.json(hash);
});

module.exports = router;
