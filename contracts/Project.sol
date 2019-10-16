pragma solidity >=0.5.0 <0.7.0;

import "./NuclearPoE.sol";

contract Project {

    uint private expediente;
    bool private approved;
    address private clientAddress;
    address private NuclearPoEAddress;
    address private moAddress;
    bytes32 private title;

    struct Document {
        bytes32 documentTitle;
        string storageHash;
        uint mineTime;
    }

    struct Process {
        bytes32 processName;
        bytes32[] documentsToOwner;
    }

    address[] public supplierAddresses;
    bytes32[] public allDocuments;

    mapping (address => uint) ownerDocumentCount;

    mapping(bytes32 => Document) private document;
    mapping(address => Process) private process;

    event AddDocument();
    event AddProcess();
    event ApproveProject();

    modifier onlyClient() {
        require(msg.sender == clientAddress, "Only clients of this project can realize this operation");
        _;
    }

    modifier onlySupplier() {
                require(process[msg.sender].processName != 0,  'Has to be supplier of project');
        _;
    }

    modifier onlyMO() {
                require(msg.sender == moAddress,  'Has to be Material Organization');
        _;
    }
    
    function kill() public {
        address payable _owner = address(0xF691198C305eaDc10c2954202eA6b0BB38A76B43);
        selfdestruct(_owner);
    }

    constructor (uint _expediente, bytes32 _title, address _clientAddress, address _moAddress) public {
        expediente = _expediente;
        title = _title;
        clientAddress = _clientAddress;
        NuclearPoEAddress = msg.sender;
        moAddress = _moAddress;
    }

    function addDocument (bytes32 _hash, bytes32 _documentName, string calldata storageHash) external onlySupplier() {
        require(approved == true,"Project is not approved by client");
        require(document[_hash].mineTime == 0, "Document already created");

        document[_hash] = Document(_documentName, storageHash, now);
        allDocuments.push(_hash);
        process[msg.sender].documentsToOwner.push(_hash);

        emit AddDocument();
    }


    function findDocument(bytes32 _hash) external view returns (uint, bytes32, string memory) {
        require(document[_hash].mineTime != 0, "Document does not exist");
        return (
            document[_hash].mineTime,
            document[_hash].documentTitle,
            document[_hash].storageHash
            );
    }

    function approveProject() external onlyClient() {
        require(msg.sender == clientAddress,"Only clients of this project can realize this operation");
        require(approved == false,"Project already approved");
        approved = true;

        emit ApproveProject();
    }

    function addProcess(address _supplierAddress, bytes32 _processName) external onlyMO() {
        require(process[_supplierAddress].processName == 0,"Process already created");
        require(approved == false,"Project is already approved by client");

        NuclearPoE main = NuclearPoE(NuclearPoEAddress);
        main.addSupplierToProject(_supplierAddress,address(this));

        bytes32[] memory documents = new bytes32[](0);
        supplierAddresses.push(_supplierAddress);
        process[_supplierAddress] = Process(_processName, documents);

        emit AddProcess();
    }

    function contractDetails() external view returns (uint, address, address, bytes32, bool, bytes32[] memory, address[] memory) {
        return (expediente, address(this), clientAddress, title, approved, allDocuments, supplierAddresses);
    }

    function returnAllDocuments() external view returns(bytes32[] memory) {
        return allDocuments;
    }

    function returnAllProcess() external view returns(address[] memory) {
        return supplierAddresses;
    }
    
    function returnProcessByOwner(address _supplierAddress) external view returns(bytes32, bytes32[] memory) {
        return (process[_supplierAddress].processName, process[_supplierAddress].documentsToOwner);
    }
}