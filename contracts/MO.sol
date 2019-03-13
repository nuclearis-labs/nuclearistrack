pragma solidity 0.5.0;


contract MO {

    struct Record {
        uint mineTime;
        uint blockNumber;
    }

    address public nrs = 0xb33fDD8b5648D8AE838a91672446499ddF1191e7;

    mapping (bytes32 => Record) private docHashes;

    function addDocHash (bytes32 hash) public {
        require(
            msg.sender == nrs,
            "Only NRS can add documents to contract."
        );
        Record memory newRecord = Record(now, block.number);
        docHashes[hash] = newRecord;
    }

    function findDocHash (bytes32 hash) public view returns(uint, uint) {
        return (docHashes[hash].mineTime, docHashes[hash].blockNumber);
    }

}
