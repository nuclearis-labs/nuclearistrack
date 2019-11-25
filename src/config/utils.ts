import Web3 from 'web3';
import UserModel from '../models/user';
import { generateRSKAddress, decryptBIP38 } from './wallet';

export function isString(string: string): string | TypeError {
  if (typeof string !== 'string') throw TypeError(`${string} is not a string`);
  return string;
}

export function isNumber(number: number): number | TypeError {
  if (!Number.isInteger(number)) throw TypeError(`${number} is not a number`);
  return number;
}

export function asciiToHex(string: string): string {
  return Web3.utils.asciiToHex(string);
}

export function toChecksumAddress(address: string): string {
  return Web3.utils.toChecksumAddress(address);
}

export function isSHA256(hash: string): string | TypeError {
  if (/\b0x[A-Fa-f0-9]{64}\b/.test(hash) === true) return hash;
  throw TypeError(`Given hash "${hash}" is not a valid SHA256 hash`);
}

export function hexToAscii(bytes32: string): string {
  return removeNullBytes(Web3.utils.hexToAscii(bytes32));
}

export function isEmail(email: string): string | TypeError {
  if (
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
      email
    ) === true
  )
    return email;
  throw TypeError(`Given email "${email}" is not a valid email`);
}

export function web3ArrayToJSArray(object: object): any[] {
  return Object.values(object);
}

export function removeNullBytes(string: string): string {
  return string.replace(/\0/g, '');
}

export async function getKeys({
  email,
  passphrase
}: {
  email: string;
  passphrase: string;
}): Promise<{ address: string; privateKey: Buffer }> {
  const user = await UserModel.findOne({ email: email });

  const privateKey = await decryptBIP38(user.encryptedPrivateKey, passphrase);
  const address = generateRSKAddress(privateKey);

  return {
    address,
    privateKey
  };
}
