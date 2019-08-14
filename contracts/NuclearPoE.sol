pragma solidity >=0.5.0 <0.7.0;
pragma experimental ABIEncoderV2;

/// @title A contract to maintain the records for the future of the nuclear industry
/// @author Sebastian Martinez
/// @notice You can use this contract for saving hashes and aditional information about mechanical documentation.
/// @dev All function calls are currently implemented without side effects
contract NuclearPoE {

    bytes32[] public documents;
    address public owner;
    bytes32[] private documents;
    address private owner;

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

    struct Project {
        address client;
        bytes32 title;
        bool approved;
        bool created;
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

    mapping (bytes32 => Document) private document;
    mapping(address => Supplier) public suppliers;
    mapping(address => Client) public clients;
    mapping (uint => Project) private project;

    constructor() public {
      owner = msg.sender;
    }

    modifier onlySupplier() {
    require(msg.sender == suppliers[msg.sender].direction,"Only supplier can realize this operation");_;
    }

    modifier onlyClient() {
    require(msg.sender == clients[msg.sender].direction,"Only clients can realize this operation");_;
    }

    modifier onlyOwner() {
    require(msg.sender == owner,"Only owner can make this change");_;
    }

    /// @notice Creates a new entry in the documents
    function addDocHash (bytes32 hash, uint32 mineTime, bytes32 titulo, bytes32 storageHash, uint8 storageFunction, uint8 storageSize) public onlySupplier {
        document[hash] = Document(msg.sender, mineTime, block.number, titulo, storageHash, storageFunction, storageSize);
    /// @param hash Hash of document
    /// @param expediente Expediente del proyecto
    /// @param mineTime Timestamp of operation
    /// @param titulo Title of document
    /// @param storageHash Hash of Storage
    /// @param storageFunction Function of Storage Hash
    /// @param storageSize Size of Storage Hash
        require(document[hash].created == false,"Document already created");
        require(project[expediente].created == true,"Project does not exist");
        require(project[expediente].approved == true,"Project is not approved by client");
        documents.push(hash);
    }

    /// @notice Lets the supplier add a note to the uploaded document
    /// @param hash Hash of document
    /// @param note Note from the supplier
      require(document[hash].user == msg.sender, "User does not match");
      require(document[hash].created == true, "Document does not exist");
    /// @notice Checks for existing Document
    /// @param hash Hash of requested document
    /// @return user Address who saved document
    /// @return mineTime Timestamp of operation
    /// @return blockNumber Block Number of TX
    /// @return title Title of document
    /// @return note Note from supplier
        require(document[hash].blockNumber != 0,"Document does not exist");
    /// @notice Checks for existing Document
    /// @param hash Hash of requested document
    /// @return storageHash Hash of Storage
    /// @return storageFunction Function of Storage Hash
    /// @return storageSize Size of Storage Hash
        require(document[hash].blockNumber != 0,"Document does not exist");
    /// @notice Get an array of all documents saved inside the contract
    /// @return A bytes32 array with all documents
    function getDocuments() public view onlyOwner returns (bytes32[] memory) {
        return documents;
    }

    /// @notice Adds a new allowed supplier to the contract
    function addSupplier(address direction, bytes32 name) public {
      suppliers[direction] = Supplier(direction, name);
    /// @param direction Address of suppliers
    /// @param name Name of supplier
      require(suppliers[direction].created == false,"Supplier already created");
      require(clients[direction].created == false,"Is already a client");
      require(owner != direction,"Is owner");
    }

    /// @notice Adds a new client to the contract
    function addClient(address direction, bytes32 name) public {
      clients[direction] = Client(direction, name);
    /// @param direction Address of client
    /// @param name Name of client
      require(clients[direction].created == false,"Client already created");
      require(suppliers[direction].created == false,"Is already a supplier");
      require(owner != direction,"Is owner");
    }

    function findDocHash (bytes32 hash) public view returns(address,uint32, uint256, bytes32, bytes32, uint8, uint8) {
        return (document[hash].user,
        document[hash].mineTime,
        document[hash].blockNumber,
        document[hash].title,
        document[hash].storageHash,
        document[hash].storageFunction,
        document[hash].storageSize);
    /// @notice Adds a new client to the contract
    /// @param expediente Number of expediente
    /// @param client Name of client
    /// @param title Title of document
    function addProject(uint expediente, address client, bytes32 title) public onlyOwner {
      require(project[expediente].created == false, "Project already created");
      require(clients[client].direction == client, "Client is not registered");
      project[expediente] = Project(client, title, false, true);
    }

    /// @notice Approves the project with
    /// @param expediente Number of expediente
    function approveProject(uint expediente) public onlyClient {
      require(project[expediente].approved == false,"Project already approved");
      require(project[expediente].client == msg.sender, "Different client registered");
      project[expediente].approved = true;
    }

}
