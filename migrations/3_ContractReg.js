var ContractStorage = artifacts.require("./ContractReg.sol");

module.exports = function(deployer) {
  deployer.deploy(ContractStorage);
};
