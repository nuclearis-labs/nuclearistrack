const Transaction = require('../classes/Transaction');
const { getKeys } = require('../functions/utils');
const web3 = require('../services/web3');
import logger from '../config/winston';

module.exports.transfer = async (req, res) => {
  try {
    const { address, privateKey } = await getKeys({
      email: req.body.email,
      passphrase: req.body.passphrase,
      coin: process.env.DEVIATIONCOIN
    });

    const balance = await web3.eth.getBalance(address);

    if (Number(web3.utils.fromWei(balance)) < Number(req.body.value)) {
      throw Error('Not sufficient funds');
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

    logger.info(`Transfered ${req.body.value} to ${req.body.to} `, {
      txHash: txHash
    });
    res.json({ txHash });
  } catch (e) {
    logger.error(`Couldn't transfer ${req.body.value} to ${req.body.to} `, {
      message: e.message
    });
    res.status(400).json({ error: e.message });
  }
};
