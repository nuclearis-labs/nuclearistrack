pragma solidity 0.5.0;


contract MO {


    struct Record {
        uint mineTime;
        uint blockNumber;
    }

    address public nrs = 0x211d5C2fb17ee2b9c412aeC36f4A4CA274Bb131F;

    mapping (bytes32 => Record) private docHashes;

    function addDocHash (bytes32 hash) public {
        require(
            msg.sender == nrs,
            "Only NRS can modify contract."
        );
        Record memory newRecord = Record(now, block.number);
        docHashes[hash] = newRecord;
    }

    function findDocHash (bytes32 hash) public view returns(uint, uint) {
        return (docHashes[hash].mineTime, docHashes[hash].blockNumber);
    }

}
