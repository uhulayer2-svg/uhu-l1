// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract UHUToken {
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    uint256 public totalSupply;
    address public owner;
    address public compliance;
    
    bool public paused = false; // สำหรับเปิด-ปิด ระบบโอนทั้งหมด

    mapping(address => uint256) public balanceOf;
    mapping(address => bool) public frozen; // สำหรับแช่แข็งกระเป๋า

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Mint(address indexed to, uint256 value);
    event Burn(address indexed from, uint256 value);
    event Paused(bool isPaused);
    event Frozen(address indexed target, bool isFrozen);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only Captain can do this!");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "System is currently paused!");
        _;
    }

    constructor(string memory _name, string memory _symbol, address _compliance) {
        name = _name;
        symbol = _symbol;
        compliance = _compliance;
        owner = msg.sender;
        
        // มิ้นเหรียญเริ่มต้นให้กัปตัน 1 ล้านเหรียญ
        _mint(msg.sender, 1000000 * 10**uint256(decimals));
    }

    // 🪄 [A] MINT: เสกเหรียญเพิ่ม
    function mint(address _to, uint256 _amount) public onlyOwner {
        _mint(_to, _amount);
    }

    // 🔥 [B] BURN: เผาเหรียญทิ้ง
    function burn(uint256 _amount) public {
        require(balanceOf[msg.sender] >= _amount, "Not enough coins to burn!");
        balanceOf[msg.sender] -= _amount;
        totalSupply -= _amount;
        emit Burn(msg.sender, _amount);
        emit Transfer(msg.sender, address(0), _amount);
    }

    // ⏸️ [C] PAUSE: ปิด/เปิด ระบบโอนทั้งระบบ
    function setPaused(bool _state) public onlyOwner {
        paused = _state;
        emit Paused(_state);
    }

    // ❄️ [D] FREEZE: แช่แข็งกระเป๋าเฉพาะราย
    function setFreeze(address _target, bool _state) public onlyOwner {
        frozen[_target] = _state;
        emit Frozen(_target, _state);
    }

    function _mint(address _to, uint256 _amount) internal {
        totalSupply += _amount;
        balanceOf[_to] += _amount;
        emit Mint(_to, _amount);
        emit Transfer(address(0), _to, _amount);
    }

    function transfer(address _to, uint256 _value) public whenNotPaused returns (bool success) {
        require(!frozen[msg.sender], "Your wallet is frozen!"); // เช็คกระเป๋าต้นทาง
        require(!frozen[_to], "Target wallet is frozen!"); // เช็คกระเป๋าปลายทาง
        require(balanceOf[msg.sender] >= _value, "Balance insufficient");
        
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
}