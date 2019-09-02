let express = require('express'),
    Blockchain = require('../classes/Blockchain'),
    router = express.Router({ mergeParams: true })

router.post('/', async (req, res) => {
    let process = new Blockchain(req.body.keys)
    try {
        await process.addProcess(
            Number(req.body.expediente),
            req.body.supplierAddress,
            req.body.processTitle,
            req.body.supplierName
        )
        let tx = await process.sendTx()
        res.json({ message: `Process created`, data: tx })
    } catch (e) { res.json({ error: e.message }) }
})


module.exports = router