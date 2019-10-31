const express = require('express');
const web3 = require('../services/web3');
const { verifyToken } = require('../middleware/index');
const {
  generatePrivateKey,
  generatePublicKey,
  generateRSKAddress,
  encryptBIP38,
  decryptBIP38
} = require('../functions/wallet');
const Contract = require('../classes/Contract');
const UserModel = require('../models/user');
const txModel = require('../models/transaction');
const { sendMail } = require('../functions/mail');
const {
  getKeys,
  web3ArrayToJSArray,
  isEmail,
  toChecksumAddress,
  isNumber,
  asciiToHex,
  hexToAscii,
  isString,
  createPendingTx
} = require('../functions/utils');

const router = express.Router({ mergeParams: true });

router.post('/', verifyToken, async (req, res) => {
  try {
    const newUserName = asciiToHex(req.body.newUserName);
    const newUserEmail = isEmail(req.body.newUserEmail);
    const userType = isNumber(Number(req.body.userType));

    const user = await UserModel.findOne({ newUserEmail });

    if (user) {
      throw Error('A user with the given email is already registered');
    }

    const db = await UserModel.create({
      username: req.body.newUserName,
      email: newUserEmail,
      type: userType
    });

    sendMail({ to: 'smartinez@nuclearis.com', data: db._id });

    res.status(200).json({ userID: db._id });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e.message });
  }
});

router.post('/confirm/:id', async (req, res) => {
  try {
    const newPassphrase = isString(req.body.newPassphrase);

    const user = await UserModel.findById(req.params.id);

    if (user.hasOwnProperty('address')) {
      throw Error('A user with the given id has an address');
    }

    const newPrivKey = generatePrivateKey();
    const newPublicKey = generatePublicKey(newPrivKey);
    const address = generateRSKAddress(newPublicKey);
    const encryptedPrivateKey = encryptBIP38(newPrivKey, newPassphrase);

    const { wallet, privateKey } = await getKeys({
      email: 'info@nuclearis.com',
      passphrase: 'Nuclearis'
    });

    const contract = new Contract({ privateKey });
    const txHash = await contract.sendDataToContract({
      fromAddress: wallet,
      method: 'createUser',
      data: [address, user.type, asciiToHex(user.username)]
    });

    await createPendingTx({
      hash: txHash,
      subject: 'add-user',
      data: [user.username, user.type, address]
    });

    const db = await UserModel.findByIdAndUpdate(req.params.id, {
      address,
      encryptedPrivateKey
    });

    res.json({
      username: db.username,
      email: db.email,
      address: db.address,
      encryptedPrivateKey: db.encryptedPrivateKey,
      txHash
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e.message });
  }
});

router.post('/change', verifyToken, async (req, res) => {
  try {
    const passphrase = isString(req.body.passphrase);
    const newPassphrase = isString(req.body.newPassphrase);
    const email = isEmail(req.body.email);

    const user = await UserModel.findOne({ email: email });

    console.log(user);
    const decryptedKey = decryptBIP38(user.encryptedPrivateKey, passphrase);
    const encryptedPrivateKey = encryptBIP38(decryptedKey, newPassphrase);

    const updatedClient = await UserModel.findByIdAndUpdate(user._id, {
      encryptedPrivateKey
    });

    res.json(updatedClient);
  } catch (e) {
    console.log(e);

    res.json({ error: e.message });
  }
});

router.get('/get', async (req, res) => {
  try {
    const contract = new Contract();
    const allUsers = await contract.getDataFromContract({
      method: 'getAllUsers'
    });
    response = [];

    if (allUsers.length !== 0) {
      for (let i = 0; i < allUsers.length; i++) {
        await txModel.findOneAndRemove({
          subject: 'add-user',
          data: { $in: allUsers[i] }
        });
        const details = await contract.getDataFromContract({
          method: 'getUserDetails',
          data: [allUsers[i]]
        });

        let [nombre, userType] = web3ArrayToJSArray(details);
        const balance = await web3.eth.getBalance(allUsers[i]);

        response.push({
          username: hexToAscii(nombre),
          address: allUsers[i],
          type: userType,
          balance: web3.utils.fromWei(balance)
        });
      }
      const pendingTx = await txModel.find({ subject: 'add-user' });
      for (let y = 0; y < pendingTx.length; y++) {
        response.push({
          userName: hexToAscii(pendingTx[y].data[0]),
          tx: pendingTx[y].hash,
          type: '',
          balance: '0',
          status: 'pending'
        });
      }

      res.json(response);
    } else {
      res.json([]);
    }
  } catch (e) {
    console.log(e);

    res.json({ error: e.message });
  }
});

router.get('/getBalance/:address', (req, res) => {
  web3.eth.getBalance(req.params.address).then(balance => {
    res.json(web3.utils.fromWei(balance));
  });
});

router.get('/get/:address', async (req, res) => {
  try {
    const address = toChecksumAddress(req.params.address);
    const contract = new Contract();

    const details = await contract.getDataFromContract({
      method: 'getUserDetails',
      data: [address]
    });

    const [userName, userType, userProjects] = web3ArrayToJSArray(details);
    let response = [];
    let balance = await web3.eth.getBalance(address);
    for (let i = 0; i < userProjects.length; i++) {
      let detailsResponse = await contract.getDataFromContract({
        method: 'getProjectDetails',
        data: [userProjects[i]]
      });
      let [active, clientAddress, title, oc] = web3ArrayToJSArray(
        detailsResponse
      );
      response.push({
        title: hexToAscii(title),
        expediente: userProjects[i],
        oc: hexToAscii(oc)
      });
    }

    res.json({
      userName: hexToAscii(userName),
      balance: web3.utils.fromWei(balance),
      proyectos: response
    });
  } catch (e) {
    console.log(e);

    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
