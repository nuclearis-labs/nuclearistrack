const {
  generatePrivateKey,
  generatePublicKey,
  generateRSKAddress,
  encryptBIP38
} = require('./functions/wallet');

const newPrivKey = generatePrivateKey();
const publicKey = generatePublicKey(newPrivKey);
const address = generateRSKAddress(publicKey);
const encryptedKey = encryptBIP38(newPrivKey, 'Nuclearis');

console.log(newPrivKey);
console.log(publicKey);
console.log(address);
console.log(encryptedKey);
