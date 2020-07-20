const NuclearPoE = artifacts.require('NuclearPoE');

module.exports = function (deployer) {
  deployer.deploy(NuclearPoE, 'NRS');
};
