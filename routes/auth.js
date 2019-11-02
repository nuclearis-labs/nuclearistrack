const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
const {
  generatePublicKey,
  generateRSKAddress,
  decryptBIP38
} = require('../functions/wallet');

router.post('/', async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) throw Error();

    const decryptedKey = decryptBIP38(
      user.encryptedPrivateKey,
      req.body.passphrase
    );

    if (decryptedKey === false) {
      throw Error();
    }
    address = generateRSKAddress(decryptedKey);

    if (user.address === address) {
      jwt.sign(
        {
          userName: user.username,
          userEmail: user.email,
          userType: user.type,
          address: user.address
        },
        process.env.JWT_SECRET,
        (err, token) => {
          if (err) throw Error();
          else res.json({ token });
        }
      );
    }
  } catch (e) {
    res.sendStatus(403);
  }
});

router.post('/current', (req, res) => {
  const bearerHeader = req.headers['authorization'];
  const bearer = bearerHeader.split(' ');
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    try {
      const authData = jwt.verify(req.token, process.env.JWT_SECRET);
      res.json(authData);
    } catch (e) {
      res.json({});
    }
  } else {
    res.json({});
  }
});

module.exports = router;
