const { decryptBIP38, encryptBIP38 } = require('./functions/Wallet.js');

privKey = '6PYRdD8mKiFbayDmpN6ntga1kUnd1ZzMmhsQgd6pcVN4RNSUNZocFzzRwU';

console.log(decryptBIP38(privKey, 'imeco').toString('hex'));

privKey = Buffer.from(
  'b5e0f953635fd450a37ef9e256b3d43f30f0857098d610436090824558e52dcb',
  'hex'
);

console.log(encryptBIP38(privKey, 'Nuclearis'));
