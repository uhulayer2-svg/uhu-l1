// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TrustedIssuersRegistry is Ownable {
    mapping(address => bool) public isTrusted;

    constructor() Ownable(msg.sender) {}

    function updateIssuer(address _issuer, bool _status) external onlyOwner {
        isTrusted[_issuer] = _status;
    }
}