pragma solidity >=0.5.0 <0.7.0;
pragma experimental ABIEncoderV2;

/// @title A contract to maintain the records for the future of the nuclear industry
/// @author Sebastian Martinez
/// @notice You can use this contract for saving hashes and aditional information about mechanical documentation.
/// @dev All function calls are currently implemented without side effects
contract NuclearPoE {

    address payable public owner;

    struct Document {
        address user;
        uint expediente;
        uint32 mineTime;
        uint256 blockNumber;
        bytes32 title;
        bytes32 storageHash;
        uint8 storageFunction;
        uint8 storageSize;
        bool created;
        uint noteQt;
        mapping (uint => Notes) notes;
    }

    struct Notes {
        address user;
        string note;
        bool created;
    }

    struct Process {
       bytes32 title;
       uint expediente;
       bool created;
       bytes32[] documents;
       mapping (address => Supplier) supplier;
       mapping (bytes32 => Document) document;
    }

    struct Project {
        bytes32 title;
        bool approved;
        bool created;
        mapping (address => Client) client;
        mapping (address => Process) process;
    }

    struct Supplier {
        address direction;
        bytes32 name;
        bool created;
    }

    struct Client {
        address direction;
        bytes32 name;
        bool created;
    }

    mapping(uint => Project) private project;

    constructor() public {
      owner = msg.sender;
    }

    modifier onlySupplier(uint expediente) {
    require(msg.sender == project[expediente].process[msg.sender].supplier[msg.sender].direction,"Only supplier can realize this operation");_;
    }

    modifier projectExists(uint expediente) {
    require(project[expediente].created == true, "Project does not exist");_;
    }

    modifier onlyClient(uint expediente) {
    require(msg.sender == project[expediente].client[msg.sender].direction,"Only clients of this project can realize this operation");_;
    }

    modifier onlyOwner() {
    require(msg.sender == owner,"Only owner can make this change");_;
    }

    /// @notice Get an array of all documents saved inside the contract
    /// @return A bytes32 array with all documents
    function getDocuments(uint expediente, address supplierAddress) public view onlyOwner projectExists(expediente) returns (bytes32[] memory) {
        return project[expediente].process[supplierAddress].documents;
    }

    /// @notice Creates a new entry in the documents
    /// @param hash Hash of document
    /// @param expediente Expediente del proyecto
    /// @param mineTime Timestamp of operation
    /// @param title Title of document
    /// @param storageHash Hash of Storage
    /// @param storageFunction Function of Storage Hash
    /// @param storageSize Size of Storage Hash
    function addDocument (bytes32 hash, uint expediente, uint32 mineTime, bytes32 title, bytes32 storageHash, uint8 storageFunction, uint8 storageSize) public projectExists(expediente) onlySupplier(expediente) {
        require(project[expediente].process[msg.sender].document[hash].created == false,"Document already created");
        require(project[expediente].approved == true,"Project is not approved by client");
        project[expediente].process[msg.sender].document[hash] = Document(msg.sender, expediente, mineTime, block.number, title, storageHash, storageFunction, storageSize, true, 0);

        project[expediente].process[msg.sender].documents.push(hash);
    }

    /// @notice Checks for existing Document
    /// @param hash Hash of requested document
    /// @param supplierAddress Address of supplier
    /// @return user Address who saved document
    /// @return mineTime Timestamp of operation
    /// @return blockNumber Block Number of TX
    /// @return title Title of document
    function findDocument (bytes32 hash, uint expediente, address supplierAddress) public view projectExists(expediente) returns(address, uint, uint32, uint, bytes32) {
        require(project[expediente].process[supplierAddress].document[hash].created == true, "Document does not exist");
        return (project[expediente].process[supplierAddress].document[hash].user,
          project[expediente].process[supplierAddress].document[hash].expediente,
        project[expediente].process[supplierAddress].document[hash].mineTime,
        project[expediente].process[supplierAddress].document[hash].blockNumber,
        project[expediente].process[supplierAddress].document[hash].title
      );
    }

    /// @notice Checks for existing Document
    /// @param hash Hash of requested document
    /// @param supplierAddress Address of supplier
    /// @param expediente Number of project
    /// @return storageHash Hash of Storage
    /// @return storageFunction Function of Storage Hash
    /// @return storageSize Size of Storage Hash
    function findDocumentStorage (bytes32 hash, address supplierAddress, uint expediente) public view projectExists(expediente) returns(bytes32, uint8, uint8) {
        require(project[expediente].process[supplierAddress].document[hash].created == true,"Document does not exist");
        return (project[expediente].process[supplierAddress].document[hash].storageHash,
        project[expediente].process[supplierAddress].document[hash].storageFunction,
        project[expediente].process[supplierAddress].document[hash].storageSize);
    }

    /// @notice Lets the supplier add a note to the uploaded document
    /// @param noteID ID of note
    /// @param hash Hash of document
    /// @param note Note from the supplier
    function addNote (uint noteID, bytes32 hash, uint expediente, address supplierAddress, string memory note) public projectExists(expediente)  {
      require(project[expediente].process[supplierAddress].document[hash].created == true, "Document does not exist");
      require(project[expediente].process[supplierAddress].document[hash].notes[noteID].created == false,"Note does already exist");
      project[expediente].process[supplierAddress].document[hash].notes[noteID] = Notes(msg.sender, note, true);
    }

    /// @notice Checks for existing Document
    /// @param hash Hash of requested document
    /// @param supplierAddress Address of supplier of document
    /// @param noteID ID of note to return
    /// @return noteUser User who redacted note
    /// @return note Note from user
    function returnNote (bytes32 hash, uint expediente, address supplierAddress, uint noteID) public view projectExists(expediente) returns(address, string memory) {
        require(project[expediente].process[supplierAddress].document[hash].created == true,"Document does not exist");
        require(project[expediente].process[supplierAddress].document[hash].notes[noteID].created == true,"Note does not exist");
        return (project[expediente].process[supplierAddress].document[hash].notes[noteID].user,
        project[expediente].process[supplierAddress].document[hash].notes[noteID].note
      );
    }


    /// @notice Adds a new client to the contract
    /// @param expediente Number of expediente
    /// @param clientAddress Address of client
    /// @param clientName Name of client
    /// @param projectTitle Title of document
    function createNewProject(uint expediente, bytes32 projectTitle, address clientAddress, bytes32 clientName) public onlyOwner {
        require(project[expediente].created == false, "Project already created");
        project[expediente] = Project(projectTitle, false, true);
        addClientToProject(clientAddress,expediente,clientName);
    }

    function kill() external {
        require(msg.sender == owner, "Only the owner can kill this contract");
        selfdestruct(owner);
    }


    /// @notice Approves the project with
    /// @param expediente Number of expediente
    function approveProject(uint expediente) public projectExists(expediente) onlyClient(expediente) {
        require(project[expediente].approved == false,"Project already approved");
        project[expediente].approved = true;
    }

    /// @notice Adds a new allowed supplier to the contract
    /// @param supplierAddress Address of supplier
    /// @param expediente Number of project
    /// @param processTitle Name of process
    function addProcessToProject(address supplierAddress, uint expediente, bytes32 processTitle,bytes32 supplierName) public projectExists(expediente) onlyOwner {
      require(project[expediente].process[supplierAddress].created == false, "Process already created");
      require(project[expediente].approved == false,"Project is already approved by client");
      bytes32[] memory emptyBytes32Array;
      project[expediente].process[supplierAddress] = Process(processTitle, expediente, true, emptyBytes32Array);
      addSupplierToProcess(supplierAddress,expediente,supplierName);
    }

    /// @notice Adds a new client to the contract
    /// @param clientAddress Address of client
    /// @param name Name of client
    function addClientToProject(address clientAddress, uint expediente, bytes32 name) internal onlyOwner {
      require(project[expediente].created == true, "Project does not exist");
      require(project[expediente].client[clientAddress].created == false,"Client already created");
      require(project[expediente].process[clientAddress].supplier[clientAddress].created == false,"Is already a supplier");
      require(owner != clientAddress,"Is owner");
      project[expediente].client[clientAddress] = Client(clientAddress, name, true);
    }

    /// @notice Adds a new allowed supplier to the contract
    /// @param supplierAddress Address of suppliers
    /// @param name Name of supplier
    function addSupplierToProcess(address supplierAddress, uint expediente, bytes32 name) internal onlyOwner {
      require(project[expediente].created == true, "Project does not exist");
      require(project[expediente].process[supplierAddress].created == true, "Process does not exist");
      require(project[expediente].process[supplierAddress].supplier[supplierAddress].created == false, "Supplier already created");
      require(project[expediente].client[supplierAddress].created == false, "Is already a client");
      require(owner != supplierAddress, "Is owner");
      project[expediente].process[supplierAddress].supplier[supplierAddress] = Supplier(supplierAddress, name, true);
    }
}
