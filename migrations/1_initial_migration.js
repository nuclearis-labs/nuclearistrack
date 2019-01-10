var Migrations = artifacts.require("./Migrations.sol");
var MO = artifacts.require("./MO.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(MO);
};
