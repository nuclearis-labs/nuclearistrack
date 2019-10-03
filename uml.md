# Desarrollo de una plataforma de Prueba de Existencia de Documentos

Habrá diferentes tipos de usuarios:

- El cliente que recibe el producto final
- El proveedor que sube los documentos / certificados de sus procesos
- El administrador que crea nuevos proyectos y asigna clientes y proveedores a los mismos.

# Usuario

El usuario debe poder acceder a la plataforma con su correo electronico y una contraseña (para no usar la clave privada que es dificil de recordar).

Una vez logueado como cliente debe poder ver un listado de todos los proyectos asignados a el con los siguientes datos:

- Nombre del proyecto
- Nº de Expediente
- Nº de OC

Al ingresar a un proyecto debe poder ver un resumen del proyecto donde le aparecera un detalle con:

- Expediente
- Nº de OC
- Nombre
- Cliente
- Cuando fue aprobado
- Dirección del contrato
- Listado de procesos

# Administrador

- crearProyecto (Crea un nuevo contrato de proyecto y agrega el proyecto al listado de proyectos del contrato principal)
- crearCliente (Crea un nuevo contrato de cliente y agrega el cliente al listado de clientes del contrato principal)
- crearProveedor (Crea un nuevo contrato de proveedor y agrega el proveedor al listado de proveedores del contrato principal)

# Contratos

Todos los contratos deben poder enviar una transacción
Deben poder iniciarse

# Projecto

1. Luego de ser creados deben ser agregado procesos al proyecto.
2. Deben poder ser aprobados por parte del cliente.

# Proceso

Cada proyecto tiene varios procesos.
El proceso una vez en un projecto aprobado por un cliente, debe poder recibir documentos subidos por el proveedor asignado.
Debe poder verificar que el documento enviado se encuentra guardado.
Debe poder devolver todos los documentos asignados a si mismo con la siguiente información:

- Nombre de proceso
- Nombre de proveedor
- Listado de documentos

# Wallet

Para los nuevos usuarios se debe generar una clave privada encryptada a partir de la clave privada original y una dirección RSK que se guarda en una base de datos.
Para los usuarios existentes se debe desencriptar con la contraseña provista por el usuario si con la clave privada desencriptada se puede generar la misma dirección guardada.

- generateEncryptedPrivateKey (genera una clave privada encriptada con la contraseña)
- crearAddress (Crea una dirección nueva RSK a partir de un privateKey)
- decryptPrivateKey (desencripta el private key encriptado con la contraseña)
- verifyKeys (verifica que el privateKey desencriptado pueda generar la address existente)
