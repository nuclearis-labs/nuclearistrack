const express = require('express');
const { asyncMiddleware } = require('../middleware/index');
const Blockchain = require('../classes/Blockchain');

const router = express.Router({ mergeParams: true });

router.post(
  '/get',
  asyncMiddleware(async (req, res) => {
    const client = new Blockchain(req.body.wallet, req.body.privateKey);
    let {
      supplierContractAddress,
      supplierProjects
    } = await client.getSupplierDetails();

    await res.json({ supplierContractAddress, supplierProjects });
  })
);

module.exports = router;
