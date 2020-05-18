import * as yup from 'yup';
import { setLocale } from 'yup';

// setLocale({
//   mixed: {
//     notType: 'Se debe elegir un archivo'
//   }
// });

export const ConfirmSchema = yup.object().shape({
  passphrase: yup
    .string()
    .required('Se requiere elegir una contraseña')
    .min(4, 'La contraseña debe tener un minimo de 4 characteres'),
  confirm_passphrase: yup
    .string()
    .required('Se requiere elegir una contraseña')
    .min(4, 'La contraseña debe tener un minimo de 4 characteres')
    .oneOf([yup.ref('passphrase'), null], 'Contraseñas deben coincidir')
});

export const LoginSchema = yup.object().shape({
  email: yup
    .string()
    .email(
      'El usuario debe ser su correo electronico registrado (Ej: info@ejemplo.com)'
    )
    .required('Se requiere su usuario'),
  passphrase: yup.string().required('Se requiere su contraseña')
});

export const DocumentSchema = yup.object().shape({
  passphrase: yup.string().required('Se requiere su contraseña')
});

export const TransferSchema = yup.object().shape({
  to: yup.string().required('Se requiere elegir un destinatario'),
  value: yup
    .number()
    .typeError('El monto debe ser un numero. (Ej: 1, 2, 0.001')
    .required('Se requiere un monto a transferir')
});

export const ProjectSchema = yup.object().shape({
  proyectoTitle: yup.string().required('Se requiere un nombre de proyecto'),
  clientAddress: yup.string().required('Se requiere elegir un cliente'),
  expediente: yup
    .number()
    .typeError('Expediente debe ser un numero')
    .required('Se requiere un numero de expediente'),
  oc: yup
    .number()
    .typeError('Orden de compra debe ser un numero')
    .required('Se requiere un numero de orden de compra'),
  passphrase: yup.string().required('Se requiere su contraseña')
});

export const ProcessSchema = yup.object().shape({
  processTitle: yup.string().required('Se requiere un nombre de proceso'),
  supplierAddress: yup.string().required('Se requiere elegir un proveedor'),
  passphrase: yup.string().required('Se requiere su contraseña')
});

export const UserSchema = yup.object().shape({
  newUserName: yup.string().required('Se requiere un nombre del usuario'),
  newUserEmail: yup
    .string()
    .email('Debe ser en formato email (Ej: info@ejemplo.com)')
    .required('Se requiere un correo electronico'),
  roles: yup.array().required('Se requiere definir los roles del usuario')
});
