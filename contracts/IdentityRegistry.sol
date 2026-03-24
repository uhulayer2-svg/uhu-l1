// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract IdentityRegistry is Ownable {
    mapping(address => bool) public verified;
    mapping(address => bool) public registrars; // รายชื่อนายทะเบียนด่วน

    event Verified(address indexed investor);
    event RegistrarAdded(address indexed registrar);

    constructor() Ownable(msg.sender) {}

    // กฎ: เฉพาะเจ้าของ (Timelock) หรือ นายทะเบียนด่วน เท่านั้นที่สั่งได้
    modifier onlyRegistrar() {
        require(msg.sender == owner() || registrars[msg.sender], "Not authorized");
        _;
    }

    function addVerified(address _investor) external onlyRegistrar {
        verified[_investor] = true;
        emit Verified(_investor);
    }

    function setRegistrar(address _registrar, bool _status) external onlyOwner {
        registrars[_registrar] = _status;
        emit RegistrarAdded(_registrar);
    }

    function contains(address _investor) external view returns (bool) {
        return verified[_investor];
    }
}