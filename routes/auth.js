const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

const {
  generatePublicKey,
  generateRSKAddress,
  decryptBIP38
} = require('../functions/wallet');

router.post('/', (req, res) => {
  UserModel.findOne({ email: req.body.email }).then((user, err) => {
    try {
      let address;
      if (err) throw Error();

      if (user) {
        const decryptedKey = decryptBIP38(
          user.encryptedPrivateKey,
          req.body.passphrase
        );

        if (decryptedKey === false) {
          throw Error();
        }
        address = generateRSKAddress(generatePublicKey(decryptedKey));
      }

      if ((user.address = address)) {
        jwt.sign(
          {
            userName: user.username,
            userEmail: user.email
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
});

module.exports = router;
