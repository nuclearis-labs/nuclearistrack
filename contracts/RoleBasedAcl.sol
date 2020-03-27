pragma solidity >=0.5.0 <0.7.0;

contract RoleBasedAcl {
    address public owner;
    mapping(address => mapping(string => bool)) roles;

    constructor() public {
        owner = msg.sender;
    }

    function assignRole(address entity, string calldata role)
        external
        hasRole('superadmin')
    {
        roles[entity][role] = true;
    }

    function unassignRole(address entity, string calldata role)
        external
        hasRole('superadmin')
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
            'Sender needs to have role'
        );
        _;
    }
}
