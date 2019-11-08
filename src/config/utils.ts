import Web3 from 'web3';
import UserModel from '../models/user';
import { generateRSKAddress, decryptBIP38 } from './wallet';
import txModel from '../models/transaction';

export const isString = (string: string) => {
  if (typeof string !== 'string') throw TypeError(`${string} is not a string`);
  return string;
};

export const isNumber = (number: number) => {
  if (!Number.isInteger(number)) throw TypeError(`${number} is not a number`);
  return number;
};

interface pendingTx {
  txHash: string;
  subject: string;
  data: Array<string>;
}

export const createPendingTx = async ({ txHash, subject, data }: pendingTx) => {
  return await txModel.create({
    txHash,
    subject: subject,
    data
  });
};

export const asciiToHex = (string: string) => {
  return Web3.utils.asciiToHex(string);
};

export const toChecksumAddress = (address: string) => {
  return Web3.utils.toChecksumAddress(address);
};

export const isSHA256 = (hash: string) => {
  if (/\b0x[A-Fa-f0-9]{64}\b/.test(hash) === true) return hash;
  throw Error(`Given hash "${hash}" is not a valid SHA256 hash`);
};

export const hexToAscii = (bytes32: string) => {
  return removeNullBytes(Web3.utils.hexToAscii(bytes32));
};

export const isEmail = (email: string) => {
  if (
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
      email
    ) === true
  )
    return email;
  throw Error(`Given email "${email}" is not a valid email`);
};

export const web3ArrayToJSArray = (object: object) => {
  return Object.values(object);
};

export const removeNullBytes = (string: string) => {
  return string.replace(/\0/g, '');
};

interface getKeys {
  email: string;
  passphrase: string;
}

export const getKeys = async ({
  email,
  passphrase
}: getKeys): Promise<{ address: string; privateKey: Buffer }> => {
  const user = await UserModel.findOne({ email: email });

  const privateKey = await decryptBIP38(user.encryptedPrivateKey, passphrase);
  const address = generateRSKAddress(privateKey);

  return {
    address,
    privateKey
  };
};
