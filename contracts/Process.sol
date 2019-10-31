pragma solidity >=0.5.0 <0.7.0;

import "./NuclearPoE.sol";

contract Process {

    address private NuclearPoEAddress;
    address private moAddress;
    address private supplierAddress;
    bytes32 private processName;

    struct Document {
        bytes32 latitude;
        bytes32 longitude;
        bytes32 storageHash;
        uint8 storageFunction;
        uint8 storageSize;
        uint docNumber;
        uint mineTime;
    }

    bytes32[] public allDocuments;

    mapping (bytes32 => Document) private document;

    event AddDocument();

    modifier onlySupplier() {
        require(msg.sender == supplierAddress, 'Has to be supplier of project');
        _;
    }

    modifier onlyMO() {
        require(msg.sender == moAddress, 'Has to be Material Organization');
        _;
    }

    constructor (address _moAddress, address _supplierAddress, bytes32 _processName) public {
        NuclearPoEAddress = msg.sender;
        moAddress = _moAddress;
        supplierAddress = _supplierAddress;
        processName = _processName;
    }

    function addDocument (bytes32 _hash, uint8 storageFunction, uint8 storageSize, bytes32 storageHash, bytes32 latitude, bytes32 longitude) external onlySupplier() {
        require(document[_hash].mineTime == 0, "Document already created");

        NuclearPoE main = NuclearPoE(NuclearPoEAddress);
        uint docNumber = main.incrementDocNumber(address(this));

        document[_hash] = Document(latitude, longitude, storageHash, storageFunction, storageSize, docNumber, now);
        allDocuments.push(_hash);

        emit AddDocument();
    }

    function findDocument(bytes32 _hash) external view returns (bytes32, bytes32, bytes32, uint8, uint8, uint, uint) {
        require(document[_hash].mineTime != 0, "Document does not exist");
        return (
            document[_hash].latitude,
            document[_hash].longitude,
            document[_hash].storageHash,
            document[_hash].storageFunction,
            document[_hash].storageSize,
            document[_hash].docNumber,
            document[_hash].mineTime
            );
    }

    function getDetails() external view returns (address, address, address, bytes32, bytes32[] memory, address) {
        return (NuclearPoEAddress, moAddress, supplierAddress, processName, allDocuments, address(this));
    }

    function getAllDocuments() external view returns(bytes32[] memory) {
        return allDocuments;
    }
}