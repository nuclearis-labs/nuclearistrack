const ipfs = require('ipfs-http-client')('localhost', '5001', {
  protocol: 'http'
});

module.exports = ipfs;
