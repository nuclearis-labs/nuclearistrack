pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;


contract RoleBasedAcl {
    address public owner;
    mapping(address => mapping(string => bool)) roles;

    constructor() public {
        owner = msg.sender;
    }

    function assignRole(address entity, string calldata role)
        external
        hasRole('admin')
    {
        roles[entity][role] = true;
    }

    function assignMultipleRoles(address entity, string[] calldata role)
        external
        hasRole('admin')
    {
        for (uint256 i = 0; i < role.length; i++) {
            roles[entity][role[i]] = true;
        }
    }

    function unassignRole(address entity, string calldata role)
        external
        hasRole('admin')
    {
        roles[entity][role] = false;
    }

    function isAssignedRole(address entity, string calldata role)
        external
        view
        returns (bool)
    {
        return roles[entity][role];
    }

    modifier hasRole(string memory role) {
        require(
            roles[msg.sender][role] || msg.sender == owner,
            'Sender does not have the correct role'
        );
        _;
    }
}
