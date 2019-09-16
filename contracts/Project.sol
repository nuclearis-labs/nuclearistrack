pragma solidity >=0.5.0 <0.7.0;

// Contrato de proyectos, cada vez que se crea un proyecto nuevo se debe generar un contrato proyecto.
contract Project {

    uint public expediente;
    bool public approved;
    address public contractAddress;
    address public clientAddress;
    bytes32 public title;

    struct Document {
        address user;
        uint mineTime;
        uint256 blockNumber;
        bytes32 title;
        bool created;
    }

    struct Process {
        bytes32 title;
        bool created;
        mapping(bytes32 => Document) documents;
    }

    struct SupplierStruct {
        address contractAddress;
        bytes32 name;
        bool created;
    }

    bytes32[] public allDocuments;
    uint public documentQty;

    mapping(address => Process) public process;
    mapping(address => SupplierStruct) public supplierContracts;

    event AddDocument(bytes32 hash, uint mineTime, uint blockNumber);
    event AddProcess(address _supplierAddress, bytes32 processTitle);
    event ApproveProject(uint expediente);

    constructor (uint _expediente, bytes32 _title) public {
        expediente = _expediente;
        title = _title;
        contractAddress = address(this);
        documentQty = 0;
    }

    function contractDetails() public view returns (uint, bytes32) {
        return (expediente, title);
    }
    // Función temporal para clean-room testing, borrar para production
    function kill() external {
        selfdestruct(msg.sender);
    }

    function setClientAddress(address _a) public {
        clientAddress = _a;
    }

    function addDocument (address _supplier, bytes32 hash, bytes32 docTitle) public {
        require(approved == true,"Project is not approved by client");
        require(process[_supplier].created == true, "Process does not exist");
        require(process[_supplier].documents[hash].created == false,"Document already created");

        process[_supplier].documents[hash] = Document(msg.sender, now, block.number, docTitle ,true);
        allDocuments.push(hash);
        documentQty++;
        emit AddDocument(hash, now, block.number);
    }

    function findDocument(address _supplier, bytes32 hash) public view returns (address, uint, uint, bytes32) {
        require(process[_supplier].documents[hash].created == true, "Document does not exist");
        return (process[_supplier].documents[hash].user, process[_supplier].documents[hash].mineTime, process[_supplier].documents[hash].blockNumber, process[_supplier].documents[hash].title);
    }

    function approveProject() public {
        require(approved == false,"Project already approved");
        require(msg.sender == clientAddress,"Only clients of this project can realize this operation");
        approved = true;
        emit ApproveProject(expediente);
    }

    function addProcess(address _supplier, bytes32 processTitle, bytes32 supplierName) public {

        address newSupplierContractAddress;

        // Verificacion de existencia de contrato de supplier
        if(supplierContracts[_supplier].created == false) {
            Supplier newSupplier = new Supplier(supplierName);
            newSupplierContractAddress = newSupplier.contractAddress();
        } else {
            newSupplierContractAddress = supplierContracts[_supplier].contractAddress;
        }

        supplierContracts[_supplier] = SupplierStruct(newSupplierContractAddress, supplierName,true);


        process[_supplier] = Process(processTitle,true);
        emit AddProcess(_supplier, processTitle);
    }
}

// Contrato de proveedores que se genera para cada proveedor nuevo y hace seguimiento a los proyectos nuevos asignados
contract Supplier {

    bytes32 public name;
    address public contractAddress;

    constructor (bytes32 _name) public {
        name = _name;
        contractAddress = address(this);
    }
    function contractDetails() public view returns (bytes32) {
        return (name);
    }
}