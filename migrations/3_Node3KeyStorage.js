const KeyStorage = artifacts.require("Node3KeyStorage");

module.exports = function (deployer) {
  deployer.deploy(KeyStorage,"0x1619d372905582a0EE175201138005581cfe007c");
};