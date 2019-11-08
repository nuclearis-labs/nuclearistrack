import express from 'express';
const { verifyToken, validateForm } = require('../../middleware/index');
const router = express.Router({ mergeParams: true });
const rules = require('../../services/validationRules');
const ProcessController = require('../controller/ProcessController');
router.post('/', verifyToken, validateForm(rules.processCreate), ProcessController.create);
router.get('/getOne', validateForm({
    'params.contract': 'required|checksumAddress'
}), ProcessController.getOne);
router.get('/getByExpediente', validateForm({
    expediente: 'required|integer'
}), ProcessController.getByID);
router.get('/get', verifyToken, ProcessController.get);
module.exports = router;
//# sourceMappingURL=process.js.map