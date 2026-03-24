// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract IdentityRegistry {
    address public claimTopicsRegistry;
    address public trustedIssuersRegistry;
    address public owner;
    mapping(address => address) public identities;

    constructor(address _topics, address _issuers, address _owner) {
        claimTopicsRegistry = _topics;
        trustedIssuersRegistry = _issuers;
        owner = _owner;
    }

    function registerIdentity(address _user, address _identity) external {
        identities[_user] = _identity;
    }

    function identity(address _user) external view returns (address) {
        return identities[_user];
    }
}