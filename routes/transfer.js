const express = require('express');
const Transaction = require('../classes/Transaction');
const router = express.Router({ mergeParams: true });
const { getKeys } = require('../functions/utils');
const web3 = require('../services/web3');
const { verifyToken } = require('../middleware/index');

router.post('/to/:to/:value', async (req, res) => {
  try {
    const { wallet, privKey } = await getKeys(req.body);

    const balance = await web3.eth.getBalance(wallet);

    console.log(req.params.value);
    console.log(web3.utils.fromWei(balance));

    if (Number(web3.utils.fromWei(balance)) < Number(req.params.value)) {
      throw Error('Not sufficient funds..');
    }

    const tx = new Transaction(req.params.to, wallet);
    await tx.estimateGas();
    await tx.getNonce();
    tx.prepareRawTx(req.params.value, req.params.to, 4000000)
      .sign(privKey)
      .serialize();

    const txHash = await tx.send();

    res.json(txHash);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
