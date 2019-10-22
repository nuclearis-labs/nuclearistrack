const { decryptBIP38, encryptBIP38 } = require('./functions/Wallet.js');

privKey = '6PYRdD8mKiFbayDmpN6ntga1kUnd1ZzMmhsQgd6pcVN4RNSUNZocFzzRwU';

console.log(decryptBIP38(privKey, 'imeco').toString('hex'));

privKey = Buffer.from(
  '53dce971e68aa3422fc0f7dc3387612f69555ffa9946642be80c184cd591ea5f',
  'hex'
);

console.log(encryptBIP38(privKey, 'Nuclearis'));
