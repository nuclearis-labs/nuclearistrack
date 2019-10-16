pragma solidity >=0.5.0 <0.7.0;

import "./Ownable.sol";

contract User is Ownable {

    bytes32 private name;
    address public userAddress;
    address[] private projectAddresses;

    constructor (bytes32 _name, address _address) public {
        name = _name;
        userAddress = _address;
    }

    function kill() public {
        address payable _owner = address(0xF691198C305eaDc10c2954202eA6b0BB38A76B43);
        selfdestruct(_owner);
    }

    function contractDetails() external view returns (bytes32, address[] memory) {
        return (name, projectAddresses);
    }

    function addProject(address _a) external {
        projectAddresses.push(_a);
    }
}