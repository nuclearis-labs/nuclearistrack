// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import './NuclearPoE.sol';

/// @title Process Contract
/// @author Sebastian A. Martinez
/// @notice This contract is responsible for each process and its corresponding documents
contract Process {
    string private processName;
    address private supplierAddress;
    address private owner;

    struct Document {
        string name;
        string latitude;
        string longitude;
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

    constructor(
        address _supplierAddress,
        string memory _processName,
        address _ownerAddress
    ) public {
        supplierAddress = _supplierAddress;
        processName = _processName;
        owner = _ownerAddress;
    }

    /// @notice Creates a new document
    /// @param _name Name of new document
    /// @param _hash Hash of document
    /// @param _latitude Latitude
    /// @param _longitude Longitude
    /// @param _comment Comment
    function addDocument(
        string calldata _name,
        bytes32 _hash,
        string calldata _latitude,
        string calldata _longitude,
        string calldata _comment
    ) external onlySupplier() {
        require(document[_hash].mineTime == 0, 'Document already created');

        //solhint-disable-next-line not-rely-on-time
        document[_hash] = Document(_name, _latitude, _longitude, now, _comment);
        allDocuments.push(_hash);

        emit AddDocument(_hash);
    }

    /// @notice Gets document metadata by hash
    /// @param _hash Hash of document
    /// @return string Name of document
    /// @return string Latitude
    /// @return string Longitude
    /// @return uint256 mineTime Moment the transaction got mined
    /// @return string Comment
    function getDocument(bytes32 _hash)
        external
        view
        returns (
            string memory,
            bytes32,
            string memory,
            string memory,
            uint256,
            string memory
        )
    {
        require(document[_hash].mineTime != 0, 'Document does not exist');
        return (
            document[_hash].name,
            _hash,
            document[_hash].latitude,
            document[_hash].longitude,
            document[_hash].mineTime,
            document[_hash].comment
        );
    }

    /// @notice Gets details about this contract
    /// @return address Address of supplier of this process
    /// @return string Name of process
    /// @return bytes32[] Array of all document hashes in this process
    /// @return address Address of contract
    function getDetails()
        external
        view
        returns (
            address,
            string memory,
            bytes32[] memory,
            address
        )
    {
        return (supplierAddress, processName, allDocuments, address(this));
    }
}
