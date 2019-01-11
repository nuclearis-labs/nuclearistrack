# NUCLEARIS Material Organization
Desarrollo MVP (minimum viable product) de una aplicación decentralizada (dApp) para verificar la autenticidad de documentos a traves de la Blockchain de [RSK](https://github.com/rsksmart/rskj).

# Concepto
A continuacion un primer desarrollo del concepto que se quiere lograr.

## Carga de documentos
 1. A traves de un front-end se permite al usuario cargar un documento y a continuación se deben realizar las siguientes operaciones:
    - Se genera el hash de ese documento con crypto-JS<sup>[1](#ft1)</sup>.
    - Se carga el documento a la red IPFS<sup>[2](#ft2)</sup> a traves de un nodo de la misma red, lo cual genera un hash de IPFS.
 2. El smart contract que fue guardado en la blockchain, debe guardar (si la address esta en la whitelist del contrato) los siguientes datos anteriormente generados en su storage:
    - Numero de ID que identifica cada documento y cuenta cantidad de documentos
    - Timestamp del momento de carga del documento
    - Hash del documento.
    - IPFS Storage Hash del documento.
    - La address de la persona que subio el documento

 ## Verificación de documentos
 1. El Front-End debe permitir cargar un documento para su verificación, en la cual se genera nuevamente el hash.
 2. El smart contract debe tomar el hash generado y con un loop chequear si el documento cargado se encuentra en su storage y en el caso que si, emitir un aviso de autenticidad. En el caso contrario avisar que no se encuentra el documento o que no es autentico.

<a name="ft1">1</a>: JavaScript library of crypto standards. (https://www.npmjs.com/package/crypto-js)

<a name="ft2">2</a>: InterPlanetary File System - IPFS (https://ipfs.io/)