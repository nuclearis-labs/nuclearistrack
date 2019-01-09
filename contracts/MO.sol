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

  //El mapping del struct a una variable tipo array
  mapping(uint => Documento) public documentos;

  // La definición de una variable que lleva cuenta de la cantidad de documentos cargados
  uint public documentoCount;

  // Esta función toma los argumentos (hash de documento, hash de ubicación en ipfs y timestamp), y los agrega al storage, ademas aumenta el documentoCount mas 1
  function addHash (uint timestamp, string memory doc_hash, string memory ipfs_hash) public {
    documentoCount ++;
    documentos[documentoCount] = Documento(documentoCount, timestamp, doc_hash, ipfs_hash, msg.sender);
  }

  /* Esta funcion debe tomar un string hash pasado por el front-end al contrato y chequearlo en un loop contra los hashes guardados en storage (en desarrollo, ayuda bienvenida)
  function checkHash (string memory _hash) public {
    for (uint i=1; i <= documentoCount; i++) {

    }
  }*/

  function listdocHash (uint id) public view returns (string memory) {
    return documentos[id].doc_hash;
  }
  function Cantdoc () public view returns (uint) {
    return documentoCount;
  }
  function listipfsHash (uint id) public view returns (string memory) {
    return documentos[id].ipfs_hash;
  }
  function listowner (uint id) public view returns (address) {
    return documentos[id].owner;
  }
}
