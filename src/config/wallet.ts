require('dotenv').config();
import { privateToAddress } from 'ethereumjs-util';
import { toChecksumAddress } from './utils';
import wif from 'wif';
import bip38 from 'bip38';
import { networks } from 'bitcoinjs-lib';
import bip39 from 'bip39';
import bip32 from 'bip32';
import { AssertionError } from 'assert';

function generateWifPrivateKey(
  privKey: Buffer,
  network = networks.testnet.wif
): string {
  return wif.encode(network, privKey, true);
}

export function encryptBIP38(privKey: Buffer, passphrase: string): string {
  const decoded = wif.decode(
    generateWifPrivateKey(privKey),
    networks.testnet.wif
  );
  return bip38.encrypt(decoded.privateKey, decoded.compressed, passphrase);
}

export async function decryptBIP38(
  encryptedKey: string,
  passphrase: string
): Promise<Buffer> {
  try {
    const { privateKey } = bip38.decrypt(encryptedKey, passphrase);
    return privateKey;
  } catch (e) {
    console.log(e.message);

    if (e instanceof AssertionError) {
      throw Error('Passphrase or User incorrect');
    }
  }
}

export function generateMnemonic(): string {
  return bip39.generateMnemonic();
}

export async function generatePrivateKeyFromMnemonic({
  mnemonic,
  coin = '0',
  account = 0,
  index = 0
}: {
  mnemonic: string;
  coin: string;
  account?: number;
  index?: number;
}): Promise<Buffer> {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const node = bip32.fromSeed(seed);
  return node.derivePath(`m/44'/${coin}'/${account}'/0/${index}`).privateKey;
}

export function generateRSKAddress(privateKey: Buffer): string {
  try {
    return toChecksumAddress(privateToAddress(privateKey).toString('hex'));
  } catch (e) {
    console.log(e);
  }
}
