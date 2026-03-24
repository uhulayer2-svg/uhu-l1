// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract UHUToken is ERC20, Ownable {
    address public compliance;
    uint256 private constant INITIAL_SUPPLY = 10_000_000_000 * 10**18;

    event ComplianceUpdated(address indexed oldCompliance, address indexed newCompliance);

    constructor(address _compliance) ERC20("UHU Ecosystem Token", "UHU") Ownable(msg.sender) {
        compliance = _compliance;
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function updateCompliance(address _newCompliance) external onlyOwner {
        address oldCompliance = compliance;
        compliance = _newCompliance;
        emit ComplianceUpdated(oldCompliance, _newCompliance);
    }

    function transfer(address to, uint256 amount) public override returns (bool) {
        return super.transfer(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}