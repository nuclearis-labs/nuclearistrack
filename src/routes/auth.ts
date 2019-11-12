require('dotenv').config();
import express from 'express';
import jwt from 'jsonwebtoken';
import logger from '../config/winston';
const router = express.Router();

import { verifyToken, validateForm } from '../config/index';
import UserModel from '../models/user';
import * as wallet from '../config/wallet';
import rules from '../config/validationRules';

router.post('/', validateForm(rules.auth), async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    const decryptedKey = await wallet.decryptBIP38(
      user.encryptedPrivateKey,
      req.body.passphrase
    );

    const address = wallet.generateRSKAddress(decryptedKey);

    if (user.address === address) {
      jwt.sign(
        {
          userName: user.username,
          userEmail: user.email,
          userType: user.type,
          address: user.address
        },
        process.env.JWT_SECRET,
        (err: Error, encoded: string) => {
          if (err) throw Error();
          else {
            logger.info(`User ${user._id} logged in}`);

            res.json({ encoded });
          }
        }
      );
    }
  } catch (e) {
    logger.error(`User ${req.body.email} couldn't log in `, {
      message: e.message
    });
    res.status(403).json({ error: e.message });
  }
});

router.post('/current', verifyToken, async (req, res) => {
  const bearer = req.headers.authorization.split(' ');
  const bearerToken = bearer[1];
  try {
    const authData = jwt.verify(bearerToken, process.env.JWT_SECRET);
    res.json(authData);
  } catch (e) {
    res.json({});
  }
});

module.exports = router;
