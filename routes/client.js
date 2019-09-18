const express = require('express');
const { asyncMiddleware } = require('../middleware/index');
const Blockchain = require('../classes/Blockchain');

const router = express.Router({ mergeParams: true });

router.post(
  '/get',
  asyncMiddleware(async (req, res) => {
    const client = new Blockchain(req.body.wallet, req.body.privateKey);
    let {
      clientContractAddress,
      clientsProjects
    } = await client.getClientDetails();

    await res.json({ clientContractAddress, clientsProjects });
  })
);

module.exports = router;
