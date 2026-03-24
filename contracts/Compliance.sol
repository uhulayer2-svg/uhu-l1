// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title Compliance
 * @dev สัญญาอัจฉริยะสำหรับควบคุมกฎเกณฑ์การโอนเหรียญ (T-REX Standard)
 */
contract Compliance {
    address public token;

    event TokenBound(address _token);

    // ฟังก์ชันสำหรับผูก Compliance เข้ากับตัวเหรียญ (Token)
    function bindToken(address _token) external {
        // ในระบบจริงควรเช็คสิทธิ์ (OnlyOwner) แต่ชุดนี้ทำแบบ Minimal เพื่อให้กัปตัน Deploy ผ่านก่อน
        token = _token;
        emit TokenBound(_token);
    }

    /**
     * @dev ฟังก์ชันหลักที่ระบบ T-REX จะมาเรียกใช้เพื่อเช็คว่าโอนได้ไหม
     * @return true ถ้าผ่านเงื่อนไข (ในเบื้องต้นเราให้ผ่านตลอดก่อนครับ)
     */
    function canTransfer(address _from, address _to, uint256 _amount) external view returns (bool) {
        // กัปตันสามารถเพิ่ม Logic ตรวจสอบตรงนี้ได้ในอนาคต
        return true; 
    }

    function isTokenBound() external view returns (bool) {
        return (token != address(0));
    }
}