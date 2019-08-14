pragma solidity >=0.5.0 <0.7.0;
pragma experimental ABIEncoderV2;

/// @title A contract to maintain the records for the future of the nuclear industry
/// @author Sebastian Martinez
/// @notice You can use this contract for saving hashes and aditional information about mechanical documentation.
/// @dev All function calls are currently implemented without side effects
contract NuclearPoE {

    bytes32[] public documents;
    address public owner;

    struct Document {
        address user;
        uint32 mineTime;
        uint256 blockNumber;
        bytes32 title;
        bytes32 storageHash;
        uint8 storageFunction;
        uint8 storageSize;
    }

    struct Supplier {
        address direction;
        bytes32 name;
    }

    struct Client {
        address direction;
        bytes32 name;
    }

    mapping (bytes32 => Document) private document;
    mapping(address => Supplier) public suppliers;
    mapping(address => Client) public clients;

    constructor() public {
      owner = msg.sender;
    }

    modifier onlySupplier() {
    require(
        msg.sender == suppliers[msg.sender].direction,
        "Only supplier can upload documentation"
    );
    _;
    }

    modifier onlyOwner() {
    require(
        msg.sender == owner,
        "Only owner can make this change"
    );
    _;
    }

    /// @notice Creates a new entry in the documents
    /// @param hash of document, timestamp of operation, title of document, hash of document storage, function of document storage, size of storage
    function addDocHash (bytes32 hash, uint32 mineTime, bytes32 titulo, bytes32 storageHash, uint8 storageFunction, uint8 storageSize) public onlySupplier {
        document[hash] = Document(msg.sender, mineTime, block.number, titulo, storageHash, storageFunction, storageSize);
        documents.push(hash);
    }

    /// @notice Get an array of all documents saved inside the contract
    /// @return A bytes32 array with all documents
    function getDocuments() public view onlyOwner returns (bytes32[] memory) {
        return documents;
    }

    /// @notice Adds a new allowed supplier to the contract
    /// @param Address of the new supplier, Name of new supplier
    function addSupplier(address direction, bytes32 name) public {
      suppliers[direction] = Supplier(direction, name);
    }

    /// @notice Adds a new client to the contract
    /// @param Address of the new client, Name of new client
    function addClient(address direction, bytes32 name) public {
      clients[direction] = Client(direction, name);
    }

    function findDocHash (bytes32 hash) public view returns(address,uint32, uint256, bytes32, bytes32, uint8, uint8) {
        return (document[hash].user,
        document[hash].mineTime,
        document[hash].blockNumber,
        document[hash].title,
        document[hash].storageHash,
        document[hash].storageFunction,
        document[hash].storageSize);
    }

}
