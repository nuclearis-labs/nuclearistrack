pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import './NuclearPoE.sol';
import './RoleBasedAcl.sol';

/// @title Process Contract
/// @author Sebastian A. Martinez
/// @notice This contract is responsible for each process and its corresponding documents
contract Process {
    bytes32 private processName;
    address public roleContract;
    address private supplierAddress;

    struct Document {
        string name;
        bytes32 latitude;
        bytes32 longitude;
        bytes32 storageHash;
        uint8 storageFunction;
        uint8 storageSize;
        uint256 mineTime;
        string comment;
    }

    bytes32[] public allDocuments;
    mapping(bytes32 => Document) private document;

    event AddDocument(bytes32 hash);

    modifier onlySupplier() {
        require(
            msg.sender == supplierAddress,
            'Sender is not supplier of project'
        );
        _;
    }

    modifier hasRole(string memory role) {
        RoleBasedAcl roleContractInstance = RoleBasedAcl(roleContract);
        require(
            roleContractInstance.isAssignedRole(msg.sender, role),
            'Sender does not have the correct role'
        );
        _;
    }

    constructor(
        address _roleContract,
        address _supplierAddress,
        bytes32 _processName
    ) public {
        roleContract = _roleContract;
        supplierAddress = _supplierAddress;
        processName = _processName;
    }

    /// @notice Creates a new document
    /// @param _name Name of new document
    /// @param _hash Hash of document
    /// @param _storageFunction Storage Function of IPFS Hash
    /// @param _storageSize Storage Size of IPFS Hash
    /// @param _storageHash Storage Hash of IPFS Hash
    /// @param _latitude Latitude
    /// @param _longitude Longitude
    /// @param _comment Comment
    function addDocument(
        string calldata _name,
        bytes32 _hash,
        uint8 _storageFunction,
        uint8 _storageSize,
        bytes32 _storageHash,
        bytes32 _latitude,
        bytes32 _longitude,
        string calldata _comment
    ) external onlySupplier() hasRole('document:create') {
        require(document[_hash].mineTime == 0, 'Document already created');

        document[_hash] = Document(
            _name,
            _latitude,
            _longitude,
            _storageHash,
            _storageFunction,
            _storageSize,
            now,
            _comment
        );
        allDocuments.push(_hash);

        emit AddDocument(_hash);
    }

    /// @notice Gets document metadata by hash
    /// @param _hash Hash of document
    /// @return string Name of document
    /// @return bytes32 Latitude
    /// @return bytes32 Longitude
    /// @return uint256 mineTime Moment the transaction got mined
    /// @return string Comment
    function getDocument(bytes32 _hash)
        external
        view
        hasRole('document:read')
        returns (
            string memory,
            bytes32,
            bytes32,
            uint256,
            string memory
        )
    {
        require(document[_hash].mineTime != 0, 'Document does not exist');
        return (
            document[_hash].name,
            document[_hash].latitude,
            document[_hash].longitude,
            document[_hash].mineTime,
            document[_hash].comment
        );
    }

    /// @notice Gets document storage information by hash
    /// @param _hash Hash of document
    /// @return bytes32 storageHash
    /// @return uint8 storageFunction
    /// @return uint8 storageSize
    function getDocumentStorage(bytes32 _hash)
        external
        view
        hasRole('document:read')
        returns (
            bytes32,
            uint8,
            uint8
        )
    {
        require(document[_hash].mineTime != 0, 'Document does not exist');
        return (
            document[_hash].storageHash,
            document[_hash].storageFunction,
            document[_hash].storageSize
        );
    }

    /// @notice Gets details about this contract
    /// @return address Address of supplier of this process
    /// @return bytes32 Name of process
    /// @return bytes32[] Array of all document hashes in this process
    /// @return address Address of contract
    function getDetails()
        external
        view
        hasRole('process:read')
        returns (
            address,
            bytes32,
            bytes32[] memory,
            address
        )
    {
        return (supplierAddress, processName, allDocuments, address(this));
    }
}
