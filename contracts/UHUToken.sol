// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract UHUToken {
    string public name = "UHU Token";
    string public symbol = "UHU";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    address public owner;
    address public compliance;

    mapping(address => uint256) public balanceOf;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event ComplianceUpdated(address indexed oldCompliance, address indexed newCompliance);

    constructor(address _compliance) {
        owner = msg.sender;
        compliance = _compliance;
        
        // 🚀 สั่งสร้าง 10,000,000,000 UHU (10 Billion)
        // สูตรคือ: 10 * 10^9 (Billion) * 10^18 (Decimals)
        _mint(msg.sender, 10 * 10**9 * 10**18);
    }

    function _mint(address _to, uint256 _amount) internal {
        totalSupply += _amount;
        balanceOf[_to] += _amount;
        emit Transfer(address(0), _to, _amount);
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "Balance insufficient");
        
        // 🛡️ ระบบ Check Compliance (ถ้ากัปตันพร้อมเปิดใช้งาน ให้เอาคอมเมนต์ออก)
        // require(ICompliance(compliance).canTransfer(msg.sender, _to, _value), "Compliance: Transfer blocked");

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
}