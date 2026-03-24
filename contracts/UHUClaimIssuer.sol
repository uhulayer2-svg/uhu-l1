// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.20;

contract UHUClaimIssuer {
    address public owner;
    mapping(address => uint256) public keyPurposes; 

    event ClaimRevoked(address indexed identity, uint256 indexed topic);
    event KeyAdded(address indexed key, uint256 indexed purpose);
    event KeyRemoved(address indexed key, uint256 indexed purpose);

    constructor(address _owner) {
        owner = _owner;
        keyPurposes[_owner] = 1; // MANAGEMENT_KEY
    }

    // --- ERC-734 Functions ---
    function addKey(address _key, uint256 _purpose) external returns (bool success) {
        require(msg.sender == owner, "Only owner");
        keyPurposes[_key] = _purpose;
        emit KeyAdded(_key, _purpose);
        return true;
    }

    function removeKey(bytes32 _key, uint256 _purpose) external returns (bool success) {
        require(msg.sender == owner, "Only owner");
        address keyAddr = address(uint160(uint256(_key)));
        delete keyPurposes[keyAddr];
        emit KeyRemoved(keyAddr, _purpose);
        return true;
    }

    // --- Claim Issuer Functions ---
    function isClaimValid(
        address _identity,
        uint256 _topic,
        bytes calldata _sig,
        bytes calldata _data
    ) external view returns (bool) {
        bytes32 digest = keccak256(abi.encode(_identity, _topic, _data));
        if (_sig.length != 65) return false;
        
        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            r := calldataload(_sig.offset)
            s := calldataload(add(_sig.offset, 32))
            v := byte(0, calldataload(add(_sig.offset, 64)))
        }
        if (v < 27) v += 27;

        address signer = ecrecover(digest, v, r, s);
        return keyPurposes[signer] == 3 || keyPurposes[signer] == 1;
    }

    function revokeClaim(bytes32 _claimId, address _identity) external returns(bool) {
        require(msg.sender == owner, "Only owner");
        return true;
    }

    function revokeClaimBySignature(bytes calldata /* signature */) external {
        require(msg.sender == owner, "Only owner");
    }
}