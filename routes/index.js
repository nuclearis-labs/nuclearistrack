const express = require('express');
const { verifyToken } = require('../middleware/index');

const router = express.Router({ mergeParams: true });

router.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la NRS Blockchain API' });
});

router.post('/test', verifyToken, (req, res) => {
  res.json({ message: 'Bienvenido a la NRS Blockchain API' });
});
module.exports = router;
