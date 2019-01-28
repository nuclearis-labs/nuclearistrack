var MO = artifacts.require("./MO.sol");
var SimpleStorage = artifacts.require("./SimpleStorage.sol");

module.exports = function(deployer) {
  deployer.deploy(MO);
  deployer.deploy(SimpleStorage);
};
