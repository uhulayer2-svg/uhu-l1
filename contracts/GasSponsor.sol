// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract GasSponsor is Ownable {
    mapping(address => bool) public authorizedRelayers;

    constructor() Ownable(msg.sender) {}

    // รับ Native UHU เข้าถังน้ำมัน
    receive() external payable {}

    function setRelayer(address _relayer, bool _status) external onlyOwner {
        authorizedRelayers[_relayer] = _status;
    }

    function withdraw(uint256 _amount) external onlyOwner {
        payable(owner()).transfer(_amount);
    }
}