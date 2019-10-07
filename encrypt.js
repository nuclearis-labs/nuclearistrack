const Wallet = require('./classes/Wallet.js');

const wallet = new Wallet(true);

wallet.privKey = Buffer.from(
  'ad48cd5d5f2b0d93f4e190fcdaed5c74c5ba48f1382e255b7ac816dd7946a9a8',
  'hex'
);

wallet.generateWifPrivateKey().encryptBIP38('Nuclearis');

console.log(wallet);
