pragma solidity >=0.5.0 <0.7.0;

contract NuclearPoE {

    address payable public owner;

    constructor() public {
      owner = msg.sender;
    }

    struct ProjectStruct {
        address contractAddress;
        bytes32 title;
        bool created;
    }

    struct ClientStruct {
        address contractAddress;
        bytes32 name;
        bool created;
    }

    mapping(uint => ProjectStruct) public projectContracts;
    mapping(address => ClientStruct) public clientContracts;

    function createProject(uint expediente, bytes32 projectTitle, address client, bytes32 clientName) public returns (address) {
        require(projectContracts[expediente].created == false, "Project already created");

        address newClientContractAddress;

        if(clientContracts[client].created == false) {
            Client newClient = new Client(clientName);
            newClientContractAddress = newClient.contractAddress();
        } else {
            newClientContractAddress = client;
        }

        clientContracts[client] = ClientStruct(newClientContractAddress, clientName,true);

        Project newProject = new Project(expediente, projectTitle, newClientContractAddress);
        address newProjectContractAddress = newProject.contractAddress();

        projectContracts[expediente] = ProjectStruct(newProjectContractAddress,projectTitle,true);
        return newProjectContractAddress;
    }
}

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

    bytes32[] public allDocuments;
    uint public documentQty;

    mapping(address => Process) public process;

    event AddDocument(bytes32 hash, uint mineTime, uint blockNumber);

    constructor (uint _expediente, bytes32 _title, address _clientAddress) public {
        expediente = _expediente;
        title = _title;
        clientAddress = _clientAddress;
        contractAddress = address(this);
        documentQty = 0;
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
        approved = true;
    }

    function addProcess(address _supplierAddress, bytes32 processTitle) public {
        process[_supplierAddress] = Process(processTitle,true);
    }
}

contract Client {

    bytes32 public name;
    address public contractAddress;

    constructor (bytes32 _name) public {
        name = _name;
        contractAddress = address(this);
    }
}
contract Supplier {

    bytes32 public name;
    address public contractAddress;

    constructor (bytes32 _name) public {
        name = _name;
        contractAddress = address(this);
    }
}
