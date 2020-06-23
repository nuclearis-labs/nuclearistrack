var NuclearPoE = artifacts.require('../contracts/NuclearPoE.sol');
var RoleBasedAcl = artifacts.require('../contracts/RoleBasedAcl.sol');

module.exports = function(deployer) {
  deployer.deploy(RoleBasedAcl).then(() => {
    return deployer.deploy(NuclearPoE, RoleBasedAcl.address);
  });
};
