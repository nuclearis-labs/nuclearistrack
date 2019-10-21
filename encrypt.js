const { decryptBIP38 } = require('./functions/Wallet.js');

privKey = '6PYU11Dvnd6JrEBSeHUtcDzDWbST3U31EipEemzVnXTdTd9ptUYVpHYUh8';

console.log(decryptBIP38(privKey, 'imeco').toString('hex'));
