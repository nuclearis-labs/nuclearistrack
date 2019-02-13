# NUCLEARIS Material Organization

Desarrollo MVP (minimum viable product) de una aplicación decentralizada (dApp) para verificar la autenticidad de documentos a traves de la Blockchain de [RSK](https://github.com/rsksmart/rskj).

## Concepto MVP

A continuacion un primer desarrollo del concepto que se quiere lograr.

## Funcionamiento

Se detalla el funcionamiento de la herramienta.

### Carga de documentos

A traves de un front-end se permite al usuario cargar la huella digital (hash) de un documento:

- A traves de un programa de Javascript, se lee el archivo seleccionado y se genera el hash hexadecimal del archivo.
- Se pasa el hash hexadecimal al smart contract que realiza un nuevo registro en el almacenamiento (del smart contract).

### Autentificación del archivo

La autentificación de los archivos se realiza de la siguiente manera:

- El front-end recibe el archivo seleccionado por el usuario.
- Vuelve a generar el hash del archivo.
- Lo manda al smart contract para que chequee si se encuentra en su storage.
- En el caso afirmativo, devuelve la hora de minado de la transacción y el numero de bloque donde se encuentra dicho hash.

### Logica

El smart contract guardado en la blockchain bajo una dirección especifica, guarda los siguientes datos:

- Bloque en el cual fue minado la transferencia.
- Timestamp del momento de minado de dicho bloque.
- Hash del archivo.
- La address de la persona que subio el documento. (En el futuro)
  
## Front-End

Se inicio un primer desarrollo de un prototypo a traves de la herramienta Figma.
Se puede ver el diseño en la siguiente pagina, tener en cuenta que es un prototipo y va a cambiar:
[Figma Front-End Design](https://www.figma.com/file/ZykheGkC5A2vREUEjXQzmXkN/Pagina-principal?node-id=0%3A1)

## Credito

- [docCertTutorial by stbeyer](https://link.medium.com/V4nLyzqJUT)
