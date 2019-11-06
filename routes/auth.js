require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const { verifyToken, validateForm } = require('../middleware/index');
const UserModel = require('../models/user');
const wallet = require('../functions/wallet');
const rules = require('../services/validationRules');

router.post('/', validateForm(rules.auth), async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    const decryptedKey = await wallet.decryptBIP38(
      user.encryptedPrivateKey,
      req.body.passphrase
    );

    address = wallet.generateRSKAddress(decryptedKey);

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
    console.log(e);

    res.sendStatus(403);
  }
});

router.post(
  '/current',
  verifyToken,
  validateForm({
    authorization: 'required'
  }),
  async (req, res) => {
    const bearer = req.headers.authorization.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    try {
      const authData = jwt.verify(req.token, process.env.JWT_SECRET);
      res.json(authData);
    } catch (e) {
      res.json({});
    }
  }
);

module.exports = router;
