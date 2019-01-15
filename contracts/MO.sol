pragma solidity >=0.4.21 <0.6.0;

contract MO {

    // Definición del struct que define el armado de los documentos
    struct Documento {
        uint id;
        uint timestamp;
        string doc_hash;
        string ipfs_hash;
        address owner;
    }

    event votedEvent (
            uint indexed documentoCount
    );

    //El mapping del struct a una variable tipo array
    mapping(uint => Documento) public documentos;

    // La definición de una variable que lleva cuenta de la cantidad de documentos cargados
    uint public documentoCount;

    // Esta función toma los argumentos (hash de documento, hash de ubicación en ipfs y timestamp), y los agrega al storage, ademas aumenta el documentoCount mas 1
    function addHash (uint timestamp, string memory doc_hash, string memory ipfs_hash) public {
        documentoCount ++;
        documentos[documentoCount] = Documento(documentoCount, timestamp, doc_hash, ipfs_hash, msg.sender);
    }

    function Cantdoc () public view returns (uint) {
        return documentoCount;
    }

}
