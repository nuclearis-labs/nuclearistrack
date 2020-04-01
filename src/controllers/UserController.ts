import UserModel from '../models/user';
import * as utils from '../config/utils';
import * as wallet from '../config/wallet';
import { sendMail } from '../config/mail';
import web3 from '../config/web3';
import Contract from '../classes/Contract';
import logger from '../config/winston';
import { Request, Response } from 'express';

export async function create(req: Request, res: Response) {
  try {
    const db = await UserModel.create({
      username: req.body.newUserName,
      email: req.body.newUserEmail,
      roles: req.body.roles
    });

    logger.info(`User ${db._id} created {"email":${req.body.newUserEmail}}`);

    // await sendMail({
    //   to: req.body.newUserEmail,
    //   name: req.body.newUserName,
    //   id: db._id
    // });

    res.status(200).json({ userID: db._id });
  } catch (e) {
    logger.error(`User ${req.body.newUserEmail} Creation didn't worked out `, {
      message: e.message
    });
    res.status(400).json({ error: e.message });
  }
}

export async function checkRole(req: Request, res: Response) {
  try {
    const user = await UserModel.findOne({
      address: req.params.address
    });

    const contract = new Contract();
    const isRole = await contract.getDataFromContract({
      method: 'isAssignedRole',
      data: [req.params.address, req.params.role]
    });

    res.json(isRole);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function confirm(req: Request, res: Response) {
  let user: { _id: string };

  try {
    const user = await UserModel.findOne({
      _id: req.params.id,
      address: null
    });

    const mnemonic = wallet.newMnemonic();

    const newPrivateKey = await wallet.generatePrivateKeyFromMnemonic({
      mnemonic,
      coin: process.env.DERIVATIONPATHCOIN
    });

    const encryptedNewPrivateKey = wallet.encryptBIP38(
      newPrivateKey,
      req.body.passphrase
    );

    const newAddress = wallet.generateRSKAddress(newPrivateKey);

    const { address, privateKey } = await utils.getKeys({
      email: process.env.ADMINEMAIL,
      passphrase: process.env.ADMINPASSPHRASE
    });

    const contract = new Contract({ privateKey });
    const txHash = await contract.sendDataToContract({
      fromAddress: address,
      method: 'assignMultipleRoles',
      data: [newAddress, user.roles]
    });

    const db = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        address: newAddress,
        encryptedPrivateKey: encryptedNewPrivateKey
      },
      { new: true }
    );

    logger.info(`User ${user._id} confirmed {"address":${newAddress}}`);

    res.json({
      username: db.username,
      email: db.email,
      mnemonic,
      address: db.address,
      txHash
    });
  } catch (e) {
    logger.error(`User Confirmation: `, { message: e.message });
    console.log(e);

    res.status(500).json({ error: e.message });
  }
}

export async function restore(req: Request, res: Response) {
  let user: { _id: string };
  try {
    const newPrivateKey = await wallet.generatePrivateKeyFromMnemonic({
      mnemonic: req.body.mnemonic,
      coin: process.env.DERIVATIONPATHCOIN
    });

    const newEncryptedPrivateKey = wallet.encryptBIP38(
      newPrivateKey,
      req.body.newPassphrase
    );

    const newAddress = wallet.generateRSKAddress(newPrivateKey);

    user = await UserModel.findOneAndUpdate(
      { address: newAddress },
      {
        encryptedPrivateKey: newEncryptedPrivateKey
      },
      { new: true }
    );

    if (!user) {
      throw Error('No user with this mnemonic');
    }

    logger.info(`User ${user._id} restored with mnemonic passphrase`);

    res.json(user);
  } catch (e) {
    logger.error(`User not able to restore with mnemonic passphrase`, {
      message: e.message
    });

    res.status(400).json({ error: e.message });
  }
}

export async function change(req: Request, res: Response) {
  let user: { _id: string };

  try {
    const user = await UserModel.findOne({
      email: req.body.email,
      address: { $ne: null }
    });

    const decryptedKey = await wallet.decryptBIP38(
      user.encryptedPrivateKey,
      req.body.passphrase
    );
    const encryptedPrivateKey = wallet.encryptBIP38(
      decryptedKey,
      req.body.newPassphrase
    );

    await UserModel.findByIdAndUpdate(user._id, {
      encryptedPrivateKey
    });
    logger.info(`User ${user._id} changed passphrase`);

    res.sendStatus(200);
  } catch (e) {
    logger.error(`User not able to change passphrase`, {
      error: e.message
    });

    res.status(400).json({ error: e.message });
  }
}

export async function get(req: Request, res: Response) {
  try {
    const userList = await UserModel.find({}, 'username address email');
    res.json(userList);
  } catch (e) {
    logger.error(`Couldn't retrieve userList`, { message: e.message });
    res.status(500).json({ error: e.message });
  }
}

export async function getBalance(req: Request, res: Response) {
  try {
    web3.eth.getBalance(req.params.address).then(balance => {
      res.json(web3.utils.fromWei(balance));
    });
  } catch (e) {
    logger.error(`Couldn't get balance of ${req.params.address} `, {
      message: e.message
    });

    res.sendStatus(500);
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const { _id, username, address } = await UserModel.findOneAndRemove({
      address: req.params.address
    });
    logger.info(`User ${username} removed`);
    res.json({ _id, username, address });
  } catch (e) {
    logger.error(`Couldn't remove User ${req.params.address}`, {
      message: e.message
    });
    res.status(400).json({ error: e.message });
  }
}

export async function getOne(req: Request, res: Response) {
  try {
    const address = utils.toChecksumAddress(req.params.address);
    const contract = new Contract();

    const { username } = await UserModel.findOne({ address });

    const projects = await contract.getDataFromContract({
      method: 'getProjectsByAddress',
      data: [address]
    });

    const processes = await contract.getDataFromContract({
      method: 'getProcessesByAddress',
      data: [address]
    });

    let balance = await web3.eth.getBalance(address);

    res.json({
      username,
      balance: web3.utils.fromWei(balance),
      projects,
      processes
    });
  } catch (e) {
    logger.error(`Couldn't get user details ${req.params.address}`, {
      message: e.message
    });
    res.status(500).json({ error: e.message });
  }
}
