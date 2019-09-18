pragma solidity >=0.5.0 <0.7.0;

//Contrato general que manejo los subcontratos que se crean en runtime
contract NuclearPoE {

    address payable public owner;

    constructor() public {
      owner = msg.sender;
    }

    struct ProjectStruct {
        address contractAddress;
        bool created;
    }

    struct ClientStruct {
        address contractAddress;
        bool created;
    }

    mapping(uint => ProjectStruct) public projectContracts;
    mapping(address => ClientStruct) public clientContracts;

    address[] public projectContractsArray;
    uint public projectCount = 0;

    modifier onlyOwner() {
    require(msg.sender == owner,"Only owner can make this change");_;
    }

    event CreateNewProject(address newProjectContractAddress, address ClientContractAddress, uint expediente,bytes32 projectTitle);

    function createProject(uint expediente, bytes32 projectTitle, address client, bytes32 clientName) public onlyOwner() returns (address) {
        require(projectContracts[expediente].created == false, "Project already created");

        // Creacion de un nuevo contrato para el proyecto y lo guarda en el struct de proyectos.
        Project newProject = new Project(expediente, projectTitle);
        address newProjectContractAddress = newProject.contractAddress();
        projectContracts[expediente] = ProjectStruct(newProjectContractAddress,true);

        address ClientContractAddress;

        // Verificacion de existencia de contrato de cliente
        if(clientContracts[client].created == false) {
            Client newClient = new Client(clientName);
            ClientContractAddress = newClient.contractAddress();
            newClient.addProject(newProjectContractAddress);
        } else {
            ClientContractAddress = clientContracts[client].contractAddress;
            Client newClient = Client(ClientContractAddress);
            newClient.addProject(newProjectContractAddress);
        }

        clientContracts[client] = ClientStruct(ClientContractAddress, true);

        newProject.setClientAddress(client);

        projectContractsArray.push(newProjectContractAddress);
        projectCount++;

        emit CreateNewProject(newProjectContractAddress, ClientContractAddress, expediente, projectTitle);
        return newProjectContractAddress;
    }


}

// Contrato de proyectos, cada vez que se crea un proyecto nuevo se debe generar un contrato proyecto.
contract Project {

    uint public expediente;
    bool public approved = false;
    address public contractAddress;
    address public clientAddress;
    bytes32 public title;

    struct Document {
        address supplierAddress;
        uint mineTime;
        uint256 blockNumber;
        bytes32 documentTitle;
        bool created;
    }

    struct Process {
        bytes32 processName;
        bytes32 supplierName;
        address supplierContractAddress;
        bool created;
    }

    uint public supplierCount = 0;
    address[] public supplierAddresses;
    bytes32[] public allDocuments;
    uint public documentQty;

    mapping(address => Process) public process;
    mapping(bytes32 => Document) public document;

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

    function setClientAddress(address _a) public {
        clientAddress = _a;
    }

    function addDocument (address supplierAddress, bytes32 hash, bytes32 documentName) public {
        require(approved == true,"Project is not approved by client");
        require(process[supplierAddress].created == true, "Process does not exist");
        require(document[hash].created == false, "Document already created");

        document[hash] = Document(supplierAddress, now, block.number, documentName, true);
        allDocuments.push(hash);
        documentQty++;
        emit AddDocument(hash, now, block.number);
    }

    function returnDocument() public view returns(bytes32[] memory) {
        return allDocuments;
    }

    function findDocument(bytes32 hash) public view returns (address, uint, uint, bytes32) {
        require(document[hash].created == true, "Document does not exist");
        return (
            document[hash].supplierAddress,
            document[hash].mineTime,
            document[hash].blockNumber,
            document[hash].documentTitle
            );
    }

    function approveProject() public {
        require(msg.sender == clientAddress,"Only clients of this project can realize this operation");
        require(approved == false,"Project already approved");
        approved = true;
        emit ApproveProject(expediente);
    }

    function addProcess(address supplierAddress, bytes32 processName, bytes32 supplierName) public {
        require(process[supplierAddress].created == false,"Process already created");
        require(approved == false,"Project is already approved by client");

        address supplierContractAddress;

        // Verificacion de existencia de contrato de supplier
        if(process[supplierAddress].created == false) {
            Supplier newSupplier = new Supplier(supplierName);
            supplierContractAddress = newSupplier.contractAddress();
        } else {
            supplierContractAddress = process[supplierAddress].supplierContractAddress;
        }

        supplierCount++;
        supplierAddresses.push(supplierAddress);

        process[supplierAddress] = Process(processName, supplierName, supplierContractAddress, true);

        emit AddProcess(supplierAddress, processName);
    }

}


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

    function addProject(address _a) public {
        projectAddresses.push(_a);
    }

}

// Contrato de proveedores que se genera para cada proveedor nuevo y hace seguimiento a los proyectos nuevos asignados
contract Supplier {

    bytes32 public name;
    address[] public contractAddresses;
    address public contractAddress;
    
    constructor (bytes32 supplierName) public {
        name = supplierName;
        contractAddress = address(this);
    }
    
    function contractDetails() public view returns (bytes32, address[] memory) {
        return (name, contractAddresses);
    }
}