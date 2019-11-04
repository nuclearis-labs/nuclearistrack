const express = require("express");
const web3 = require("../services/web3");
const { verifyToken } = require("../middleware/index");
const wallet = require("../functions/wallet");
const Contract = require("../classes/Contract");
const UserModel = require("../models/user");
const txModel = require("../models/transaction");
const { sendMail } = require("../functions/mail");
const utils = require("../functions/utils");

const router = express.Router({ mergeParams: true });

router.post("/", verifyToken, async (req, res) => {
  try {
    const newUserEmail = utils.isEmail(req.body.newUserEmail);
    const userType = utils.isNumber(Number(req.body.userType));

    const user = await UserModel.findOne({ newUserEmail });

    if (user) {
      throw Error("A user with the given email is already registered");
    }

    const db = await UserModel.create({
      username: req.body.newUserName,
      email: newUserEmail,
      type: userType
    });

    // sendMail({ to: 'smartinez@nuclearis.com', data: db._id });

    res.status(200).json({ userID: db._id });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e.message });
  }
});

router.post("/confirm/:id", async (req, res) => {
  try {
    const passphrase = utils.isString(req.body.newPassphrase);
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      throw Error("Non existent user");
    }
    if (user.mnemonic) {
      throw Error("A user with the given id has already been confirmed");
    }

    const mnemonic = wallet.generateMnemonic();
    /*
    Ganache Passphrase
    const mnemonic =
    'speak card review photo quote endless alpha metal long reflect angle rare';
    */
    const newPrivateKey = await wallet.generatePrivateKeyFromMnemonic({
      mnemonic,
      passphrase,
      coin: process.env.DERIVATIONPATHCOIN
    });

    const newAddress = wallet.generateRSKAddress(newPrivateKey);

    const { address, privateKey } = await utils.getKeys({
      email: "info@nuclearis.com",
      passphrase: "",
      coin: process.env.DERIVATIONPATHCOIN
    });

    const contract = new Contract({ privateKey });
    const txHash = await contract.sendDataToContract({
      fromAddress: address,
      method: "createUser",
      data: [newAddress, user.type, utils.asciiToHex(user.username)]
    });

    await utils.createPendingTx({
      hash: txHash,
      subject: "add-user",
      data: [user.username, user.type, newAddress]
    });

    const db = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        address: newAddress,
        encryptedPrivateKey
      },
      { new: true }
    );

    res.json({
      username: db.username,
      email: db.email,
      mnemonic,
      address: db.address,
      encryptedPrivateKey: db.encryptedPrivateKey,
      txHash
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e.message });
  }
});

router.post("/change", verifyToken, async (req, res) => {
  try {
    const passphrase = utils.isString(req.body.passphrase);
    const newPassphrase = utils.isString(req.body.newPassphrase);
    const email = utils.isEmail(req.body.email);

    const user = await UserModel.findOne({ email: email });

    const decryptedKey = wallet.decryptBIP38(user.encryptedPrivateKey, passphrase);
    const encryptedPrivateKey = wallet.encryptBIP38(decryptedKey, newPassphrase);

    const { address, privateKey } = await utils.getKeys({
      email,
      passphrase,
      coin: process.env.DERIVATIONPATHCOIN
    });

    const contract = new Contract({ privateKey });
    const txHash = await contract.sendDataToContract({
      fromAddress: address,
      method: "changePassphrase",
      data: [newAddress]
    });

    const balance = await web3.eth.getBalance(address);

    const tx = new Transaction({ fromAddress: address });
    await tx.estimateGas();
    await tx.getNonce();
    tx.prepareRawTx({
      value: balance,
      to: newAddress,
      gaslimit: 4000000
    })
      .sign(Buffer.from(privateKey, "hex"))
      .serialize();

    const CoinHash = await tx.send();

    await utils.createPendingTx({
      hash: txHash,
      subject: "change-passphrase",
      data: [newAddress]
    });

    const updatedClient = await UserModel.findByIdAndUpdate(
      user._id,
      {
        address: newAddress
      },
      { new: true }
    );

    res.json(updatedClient);
  } catch (e) {
    console.log(e);

    res.json({ error: e.message });
  }
});

router.get("/get", async (req, res) => {
  try {
    const contract = new Contract();
    const allUsers = await contract.getDataFromContract({
      method: "getAllUsers"
    });

    const users = await UserModel.find({ address: { $in: allUsers } });

    response = [];

    if (users.length !== 0) {
      for (let i = 0; i < users.length; i++) {
        await UserModel.findByIdAndUpdate(users[i]._id, {
          status: true
        });
        console.log(users[i].address);

        const details = await contract.getDataFromContract({
          method: users[i].type == 0 ? "getClientDetails" : "getSupplierDetails",
          data: [users[i].address]
        });

        const balance = await web3.eth.getBalance(users[i].address);

        response.push({
          username: users[i].username,
          address: users[i].address,
          type: users[i].type == 0,
          balance: web3.utils.fromWei(balance),
          projects: details[2]
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

router.get("/getBalance/:address", (req, res) => {
  web3.eth.getBalance(req.params.address).then(balance => {
    res.json(web3.utils.fromWei(balance));
  });
});

router.get("/get/:address", async (req, res) => {
  try {
    const address = utils.toChecksumAddress(req.params.address);
    const contract = new Contract();

    const user = await UserModel.findOne({ address });

    const details = await contract.getDataFromContract({
      method: user.type == 0 ? "getClientDetails" : "getSupplierDetails",
      data: [address]
    });

    let response = [];
    let balance = await web3.eth.getBalance(address);
    for (let i = 0; i < details[2].length; i++) {
      let projectDetails = await contract.getDataFromContract({
        method: "getProjectDetails",
        data: [details[2][i]]
      });

      response.push({
        title: utils.hexToAscii(projectDetails[2]),
        expediente: details[2][i],
        oc: utils.hexToAscii(projectDetails[3])
      });
    }

    res.json({
      userName: user.username,
      balance: web3.utils.fromWei(balance),
      proyectos: response
    });
  } catch (e) {
    console.log(e);

    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
