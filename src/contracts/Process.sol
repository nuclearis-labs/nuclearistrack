// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.6.11;

import './NuclearPoE.sol';

/// @title Process Contract
/// @author Sebastian A. Martinez
/// @notice This contract is responsible for each process and its corresponding documents
contract Process {
    string private _processName;
    address private _supplierAddress;
    address private _owner;

    struct Document {
        string name;
        string latitude;
        string longitude;
        uint256 mineTime;
        string comment;
    }

    bytes32[] public allDocuments;
    mapping(bytes32 => Document) private _document;

    event AddDocument(bytes32 hash);

    modifier onlySupplier() {
        require(
            msg.sender == _supplierAddress,
            'Sender is not supplier of project'
        );
        _;
    }

    constructor(
        address _supplier,
        string memory _name,
        address _ownerAddress
    ) public {
        _supplierAddress = _supplier;
        _processName = _name;
        _owner = _ownerAddress;
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
        require(_document[_hash].mineTime == 0, 'Document already created');

        _document[_hash] = Document(
            _name,
            _latitude,
            _longitude,
            now, //solhint-disable-line not-rely-on-time
            _comment
        );
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
        require(_document[_hash].mineTime != 0, 'Document does not exist');
        return (
            _document[_hash].name,
            _hash,
            _document[_hash].latitude,
            _document[_hash].longitude,
            _document[_hash].mineTime,
            _document[_hash].comment
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
        return (_supplierAddress, _processName, allDocuments, address(this));
    }
}
