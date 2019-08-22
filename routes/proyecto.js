let express = require('express'),
    Blockchain = require('../classes/Blockchain'),
    router = express.Router({ mergeParams: true })

router.get('/list', (req, res) => {
    res.json({ message: 'Upload Form' })
})

router.post('/', async (req, res) => {
    let blockchain = new Blockchain()
    await blockchain.addProject(41955, 'Test', 'Address', 'Name')
    await blockchain.sendTx()

    res.json({ message: 'Upload Form' })
})

module.exports = router
