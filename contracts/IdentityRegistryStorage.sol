// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract IdentityRegistry is Ownable {
    mapping(address => bool) public isVerified;

    event IdentityRegistered(address indexed investor, bool status);

    constructor() Ownable(msg.sender) {}

    // กัปตันสั่งให้ใคร "ผ่าน" KYC ได้ที่นี่
    function registerIdentity(address _investor, bool _status) external onlyOwner {
        isVerified[_investor] = _status;
        emit IdentityRegistered(_investor, _status);
    }

    // ฟังก์ชันตรวจสอบสิทธิ์ (เหรียญ UHU จะมาเรียกใช้ตรงนี้)
    function contains(address _investor) external view returns (bool) {
        return isVerified[_investor];
    }
}