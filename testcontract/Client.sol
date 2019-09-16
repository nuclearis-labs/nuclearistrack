pragma solidity >=0.5.0 <0.7.0;

// Contrato de cliente que se genera para cada cliente nuevo y hace seguimiento a los proyectos nuevos asignados
contract Client {

    bytes32 public name;
    address public contractAddress;
    address[] public projectAddresses;

    constructor (bytes32 _name) public {
        name = _name;
        contractAddress = address(this);
    }

    function contractDetails() public view returns (bytes32, address[] memory) {
        return (name, projectAddresses);
    }

    // Función temporal para clean-room testing, borrar para production
    function kill() external {
        selfdestruct(msg.sender);
    }

    function addProject(address _a) public {
        projectAddresses.push(_a);
    }

}