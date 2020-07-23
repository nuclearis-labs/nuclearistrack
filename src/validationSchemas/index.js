import * as yup from 'yup';

export const ProjectSchema = yup.object().shape({
  proyectoTitle: yup.string().required('Se requiere un nombre de proyecto'),
  expediente: yup
    .number()
    .typeError('Expediente debe ser un numero')
    .required('Se requiere un numero de expediente'),
  oc: yup.string().required('Se requiere una orden de compra'),
});

export const ProcessSchema = yup.object().shape({
  processTitle: yup.string().required('Se requiere un nombre de proceso'),
  supplierAddress: yup
    .string()
    .matches(/^(0x)?[0-9a-f]{40}$/i, 'Se debe ingresar una dirección valida')
    .required('Se requiere elegir un proveedor'),
});

export const UserSchema = yup.object().shape({
  newUserName: yup.string().required('Se requiere un nombre del usuario'),
  newUserAddress: yup
    .string()
    .matches(/^(0x)?[0-9a-f]{40}$/i, 'Se debe ingresar una dirección valida')
    .required('Se requiere definir una dirección'),
  newUserType: yup
    .string()
    .matches(/1|2/, 'Se requiere definir un tipo de usuario')
    .required('Se requiere definir un tipo de usuario'),
});
