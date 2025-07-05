import * as yup from 'yup'

export const linkSchema = yup
  .object()
  .shape({
    title: yup
      .string()
      .required('El título es obligatorio'),
    longUrl: yup
      .string()
      .url('La URL debe ser válida')
      .required('La URL es obligatoria'),
    customUrl: yup.string(),
  })
