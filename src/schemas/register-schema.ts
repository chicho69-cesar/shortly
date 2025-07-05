import * as Yup from 'yup'

export const registerSchema = Yup
  .object()
  .shape({
    name: Yup
      .string()
      .required('El nombre es obligatorio'),
    email: Yup
      .string()
      .email('El email no es válido')
      .required('El email es obligatorio'),
    password: Yup
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .required('La contraseña es obligatoria'),
    profileImage: Yup
      .mixed()
      .required('La imagen de perfil es obligatoria'),
  })
