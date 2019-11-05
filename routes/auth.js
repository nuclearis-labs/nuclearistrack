require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const { verifyToken } = require('../middleware/index');
const UserModel = require('../models/user');
const wallet = require('../functions/wallet');
const niv = require('../services/Validator');

router.post('/', async (req, res) => {
  try {
    const v = new niv.Validator(req.body, {
      email: 'required|email|savedRecord:User,email',
      passphrase: 'required|ascii'
    });

    const matched = await v.check();
    if (!matched) {
      res.status(422).send(v.errors);
    } else {
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
    }
  } catch (e) {
    console.log(e);

    res.sendStatus(403);
  }
});

router.post('/current', verifyToken, async (req, res) => {
  const v = new niv.Validator(req.headers, {
    authorization: 'required'
  });

  const matched = await v.check();
  if (!matched) {
    res.status(422).send(v.errors);
  } else {
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
});

module.exports = router;
