require('dotenv').config();
import { privateToAddress } from 'ethereumjs-util';
import { toChecksumAddress } from './utils';
import wif from 'wif';
import bip38 from 'bip38';
import { networks } from 'bitcoinjs-lib';
import {
  generateMnemonic as bip39generateMnemonic,
  mnemonicToSeed as bip39mnemonicToSeed
} from 'bip39';
import { fromSeed } from 'bip32';
import { AssertionError } from 'assert';

const generateWifPrivateKey = (
  privKey: Buffer,
  network = networks.testnet.wif
) => {
  return wif.encode(network, privKey, true);
};

export const encryptBIP38 = (privKey: Buffer, passphrase: string) => {
  const decoded = wif.decode(
    generateWifPrivateKey(privKey),
    networks.testnet.wif
  );
  return bip38.encrypt(decoded.privateKey, decoded.compressed, passphrase);
};

export const decryptBIP38 = async (
  encryptedKey: string,
  passphrase: string
) => {
  try {
    const { privateKey } = bip38.decrypt(encryptedKey, passphrase);
    return privateKey;
  } catch (e) {
    console.log(e.message);

    if (e instanceof AssertionError) {
      throw Error('Passphrase or User incorrect');
    }
  }
};

export const generateMnemonic = () => {
  return bip39generateMnemonic();
};

export const generatePrivateKeyFromMnemonic = async ({
  mnemonic,
  coin = '0',
  account = 0,
  index = 0
}: {
  mnemonic: string;
  coin: string;
  account?: number;
  index?: number;
}) => {
  const seed = await bip39mnemonicToSeed(mnemonic);
  const node = fromSeed(seed);
  return node.derivePath(`m/44'/${coin}'/${account}'/0/${index}`).privateKey;
};

export const generateRSKAddress = (privateKey: Buffer) => {
  try {
    return toChecksumAddress(privateToAddress(privateKey).toString('hex'));
  } catch (e) {
    console.log(e);
  }
};

export const toHex = (input: Buffer) => {
  return input.toString('hex');
};
