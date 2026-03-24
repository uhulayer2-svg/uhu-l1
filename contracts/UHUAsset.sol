// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IIdentityRegistry {
    function contains(address _investor) external view returns (bool);
}

contract UHUAsset is ERC20, Ownable {
    IIdentityRegistry public identityRegistry;
    uint256 private constant MAX_SUPPLY = 1_000_000_000 * 10**18;

    // --- AI Fail-Safe & Mode Management ---
    enum OperationalMode { ACTIVE, FALLBACK, EMERGENCY }
    OperationalMode public currentMode = OperationalMode.ACTIVE;

    event ModeChanged(OperationalMode newMode);

    constructor(string memory name, string memory symbol, address _identityRegistry) 
        ERC20(name, symbol) Ownable(msg.sender) 
    {
        identityRegistry = IIdentityRegistry(_identityRegistry);
        _mint(msg.sender, MAX_SUPPLY);
    }

    // กัปตันสามารถสลับโหมดได้ด้วยตัวเอง (หรือผ่าน Timelock)
    function setOperationalMode(OperationalMode _mode) external onlyOwner {
        currentMode = _mode;
        emit ModeChanged(_mode);
    }

    function _update(address from, address to, uint256 value) internal override {
        if (from != address(0) && to != address(0)) {
            if (currentMode == OperationalMode.EMERGENCY) {
                revert("UHU-RWA: System in Emergency Lockdown");
            }
            
            // Deterministic Rules: ต้องอยู่ใน Identity Registry เสมอ (ห้าม AI มาขัดกฎนี้)
            require(identityRegistry.contains(to), "UHU-RWA: Recipient not verified");

            // ถ้าโหมด ACTIVE: ในอนาคตเราจะเพิ่มเงื่อนไข AI Signal ตรงนี้
            // ถ้าโหมด FALLBACK: จะใช้แค่กฎ On-chain (Identity Registry) อย่างเดียว
        }
        super._update(from, to, value);
    }
}