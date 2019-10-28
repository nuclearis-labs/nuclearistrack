const { decryptBIP38, encryptBIP38 } = require('./functions/Wallet.js');

privKey = '6PYRdD8mKiFbayDmpN6ntga1kUnd1ZzMmhsQgd6pcVN4RNSUNZocFzzRwU';

console.log(decryptBIP38(privKey, 'imeco').toString('hex'));

privKey = Buffer.from(
  'b79493c56182cffcb710c1e084be41b2c076a59fdff37ffa540e720f28f7e26f',
  'hex'
);

console.log(encryptBIP38(privKey, 'Nuclearis'));
