// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract IdentityRegistryStorage {
    mapping(address => address) private _identities;
    
    function registerIdentity(address _user, address _identity) external {
        _identities[_user] = _identity;
    }

    function getIdentity(address _user) external view returns (address) {
        return _identities[_user];
    }
}