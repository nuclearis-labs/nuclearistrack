const wallet = require('./functions/wallet.js');

const mnemonic =
  'speak card review photo quote endless alpha metal long reflect angle rare';

wallet
  .accountDiscovery({ mnemonic, passphrase: '', coin: 60 })
  .then(result => console.log(result))
  .catch(e => console.error(e));
