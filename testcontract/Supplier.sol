pragma solidity >=0.5.0 <0.7.0;

// Contrato de proveedores que se genera para cada proveedor nuevo y hace seguimiento a los proyectos nuevos asignados
contract Supplier {

    bytes32 public name;
    address[] public contractAddresses;
    address public contractAddress;

    constructor (bytes32 _name) public {
        name = _name;
        contractAddress = address(this);
    }

    function contractDetails() public view returns (bytes32, address[] memory) {
        return (name, contractAddresses);
    }
}