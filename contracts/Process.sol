pragma solidity >=0.5.0 <0.7.0;

import "./NuclearPoE.sol";

contract Process {

    address private NuclearPoEAddress;
    address private moAddress;
    bytes32 private processName;
    address private supplierAddress;

    struct Document {
        bytes32 latitude;
        bytes32 longitude;
        bytes32 storageHash;
        uint8 storageFunction;
        uint8 storageSize;
        uint docNumber;
        uint mineTime;
        string comment;
    }

    bytes32[] public allDocuments;

    mapping (bytes32 => Document) private document;

    event AddDocument();

    modifier onlyMain() {
        require(msg.sender == NuclearPoEAddress, 'Has to be NuclearPoE Contract');
        _;
    }

    modifier onlySupplier() {
        require(msg.sender == supplierAddress, 'Has to be supplier of project');
        _;
    }

    constructor (address _moAddress, address _supplierAddress, bytes32 _processName) public {
        NuclearPoEAddress = msg.sender;
        moAddress = _moAddress;
        processName = _processName;
        supplierAddress = _supplierAddress;
    }

    function addDocument (
        bytes32 _hash,
        uint8 _storageFunction,
        uint8 _storageSize,
        bytes32 _storageHash,
        bytes32 _latitude,
        bytes32 _longitude,
        string calldata _comment
        ) external onlySupplier() {
        require(document[_hash].mineTime == 0, "Document already created");

        NuclearPoE main = NuclearPoE(NuclearPoEAddress);
        uint docNumber = main.incrementDocNumber(address(this));

        document[_hash] = Document(_latitude, _longitude, _storageHash, _storageFunction, _storageSize, docNumber, now, _comment);
        allDocuments.push(_hash);

        emit AddDocument();
    }

    function getDocument(bytes32 _hash) external view returns (bytes32, bytes32, uint, uint, string memory) {
        require(document[_hash].mineTime != 0, "Document does not exist");
        return (
            document[_hash].latitude,
            document[_hash].longitude,
            document[_hash].docNumber,
            document[_hash].mineTime,
            document[_hash].comment
            );
    }

    function getDocumentStorage(bytes32 _hash) external view returns (bytes32, uint8, uint8) {
        require(document[_hash].mineTime != 0, "Document does not exist");
        return (
            document[_hash].storageHash,
            document[_hash].storageFunction,
            document[_hash].storageSize
            );
    }

    function getDetails() external view returns (address, address, address, bytes32, bytes32[] memory, address) {
        return (NuclearPoEAddress, moAddress, supplierAddress, processName, allDocuments, address(this));
    }

    function getAllDocuments() external view returns(bytes32[] memory) {
        return allDocuments;
    }
}