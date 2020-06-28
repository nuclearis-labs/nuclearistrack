const NuclearPoE = artifacts.require('NuclearPoE');

module.exports = function (deployer) {
  deployer.deploy(
    NuclearPoE,
    '0x4e52530000000000000000000000000000000000000000000000000000000000'
  );
};
