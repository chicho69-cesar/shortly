import * as Yup from 'yup'

export const loginSchema = Yup
  .object()
  .shape({
    email: Yup
      .string()
      .email('Email incorrecto')
      .required('El Email es obligatorio'),
    password: Yup.string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .required('La contraseña es obligatoria'),
  })
