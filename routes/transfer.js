const express = require('express');
const Transaction = require('../classes/Transaction');
const router = express.Router({ mergeParams: true });
const { getKeys } = require('../functions/utils');
const web3 = require('../services/web3');
const { verifyToken } = require('../middleware/index');

router.post('/', verifyToken, async (req, res) => {
  try {
    const { address, privateKey } = await getKeys({
      email: req.body.email,
      passphrase: req.body.passphrase,
      coin: 60
    });

    const balance = await web3.eth.getBalance(address);

    if (Number(web3.utils.fromWei(balance)) < Number(req.body.value)) {
      throw Error('Not sufficient funds..');
    }

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

    res.json(txHash);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
