// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract Faucet {
    struct AccountInfo {
        string name;
        string sex;
        string dateOfBirth;
        string phoneNumber;
        string email;
        string sign;
        string publicKey;
    }

    mapping(address => AccountInfo) public accounts;

    function setAccountInfo(
        string memory _name,
        string memory _sex,
        string memory _dateOfBirth,
        string memory _phoneNumber,
        string memory _email,
        string memory _sign,
        string memory _publicKey

    ) public {
        accounts[msg.sender] = AccountInfo(
            _name,
            _sex,
            _dateOfBirth,
            _phoneNumber,
            _email,
            _sign,
            _publicKey
        );
    }

    function getAccountInfo()
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory
        )
    {
        return (
            accounts[msg.sender].name,
            accounts[msg.sender].sex,
            accounts[msg.sender].dateOfBirth,
            accounts[msg.sender].phoneNumber,
            accounts[msg.sender].email,
            accounts[msg.sender].sign,
            accounts[msg.sender].publicKey

        );
    }
}
