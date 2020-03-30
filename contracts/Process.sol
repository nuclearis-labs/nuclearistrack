pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import './NuclearPoE.sol';
import './RoleBasedAcl.sol';


contract Process is RoleBasedAcl {
    address private NuclearPoEAddress;
    bytes32 private processName;
    address private supplierAddress;

    struct Document {
        string name;
        bytes32 latitude;
        bytes32 longitude;
        bytes32 storageHash;
        uint8 storageFunction;
        uint8 storageSize;
        uint256 docNumber;
        uint256 mineTime;
        string comment;
    }

    bytes32[] public allDocuments;
    mapping(bytes32 => Document) private document;

    event AddDocument();

    modifier onlySupplier() {
        require(
            msg.sender == supplierAddress,
            'Sender is not supplier of project'
        );
        _;
    }

    constructor(address _supplierAddress, bytes32 _processName) public {
        NuclearPoEAddress = msg.sender;
        processName = _processName;
        supplierAddress = _supplierAddress;
    }

    function addDocument(
        string calldata _name,
        bytes32 _hash,
        uint8 _storageFunction,
        uint8 _storageSize,
        bytes32 _storageHash,
        bytes32 _latitude,
        bytes32 _longitude,
        string calldata _comment
    ) external onlySupplier() {
        require(document[_hash].mineTime == 0, 'Document already created');

        NuclearPoE main = NuclearPoE(NuclearPoEAddress);

        document[_hash] = Document(
            _name,
            _latitude,
            _longitude,
            _storageHash,
            _storageFunction,
            _storageSize,
            main.docNumber(),
            now,
            _comment
        );
        allDocuments.push(_hash);

        main.incrementDocNumber(address(this));

        emit AddDocument();
    }

    function getDocument(bytes32 _hash)
        external
        view
        hasRole('document:read')
        returns (
            string memory,
            bytes32,
            bytes32,
            uint256,
            uint256,
            string memory
        )
    {
        require(document[_hash].mineTime != 0, 'Document does not exist');
        return (
            document[_hash].name,
            document[_hash].latitude,
            document[_hash].longitude,
            document[_hash].docNumber,
            document[_hash].mineTime,
            document[_hash].comment
        );
    }

    function getDocumentStorage(bytes32 _hash)
        external
        view
        hasRole('document:read')
        returns (bytes32, uint8, uint8)
    {
        require(document[_hash].mineTime != 0, 'Document does not exist');
        return (
            document[_hash].storageHash,
            document[_hash].storageFunction,
            document[_hash].storageSize
        );
    }

    function getDetails()
        external
        view
        returns (address, address, bytes32, bytes32[] memory, address)
    {
        return (
            NuclearPoEAddress,
            supplierAddress,
            processName,
            allDocuments,
            address(this)
        );
    }

    function getAllDocuments()
        external
        view
        hasRole('documents:read')
        returns (bytes32[] memory)
    {
        return allDocuments;
    }
}
