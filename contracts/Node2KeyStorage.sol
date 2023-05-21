//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract Node2KeyStorage {
    mapping (address => string) private keyParts;
    address private contractOwner;

    constructor(address _contractOwner) {
        contractOwner = _contractOwner;
    }
    modifier onlyOwner() {
        require(msg.sender == contractOwner, "Access denied");
        _;
    }
    function storeKeyPart(address owner,string memory _keyPart) public onlyOwner {
        keyParts[owner] = _keyPart;
    }

    function getKeyParts(address owner) public view onlyOwner returns (string memory) {
        return keyParts[owner];
    }
}
