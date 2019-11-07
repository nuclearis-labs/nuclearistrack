module.exports.ipfs = require('ipfs-http-client')('localhost', '5001', {
  protocol: 'http'
});

module.exports.saveToIPFS = async buffer => {
  try {
    const [{ hash }] = await this.ipfs.add(buffer);
    return hash;
  } catch (err) {
    throw Error(err);
  }
};

module.exports.getFromIPFS = async hash => {
  try {
    return await this.ipfs.get(hash);
  } catch (err) {
    throw Error(err);
  }
};
