const { decryptBIP38, encryptBIP38 } = require('./dist/config/wallet.js');

privKey = '6PYRdD8mKiFbayDmpN6ntga1kUnd1ZzMmhsQgd6pcVN4RNSUNZocFzzRwU';

console.log(decryptBIP38(privKey, 'imeco').toString('hex'));

privKey = Buffer.from(
  '7a0824e86e5c362c523d7f4991de30b56a9c04f653c33573b0a1e3b8850b23c6',
  'hex'
);

console.log(encryptBIP38(privKey, 'Nuclearis'));
