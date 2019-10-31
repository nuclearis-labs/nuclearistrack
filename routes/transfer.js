const express = require('express');
const Transaction = require('../classes/Transaction');
const router = express.Router({ mergeParams: true });
const { getKeys } = require('../functions/utils');
const web3 = require('../services/web3');
const { verifyToken } = require('../middleware/index');

router.post('/', async (req, res) => {
  try {
    const { wallet, privateKey } = await getKeys(req.body);

    const balance = await web3.eth.getBalance(wallet);

    if (Number(web3.utils.fromWei(balance)) < Number(req.body.value)) {
      throw Error('Not sufficient funds..');
    }

    const tx = new Transaction({ fromAddress: wallet });
    await tx.estimateGas();
    await tx.getNonce();
    tx.prepareRawTx(req.body.value, req.body.to, 4000000)
      .sign(Buffer.from(privateKey, 'hex'))
      .serialize();

    const txHash = await tx.send();

    res.json(txHash);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
