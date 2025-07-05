/* eslint-disable @typescript-eslint/no-explicit-any */
import { Image } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { BeatLoader } from 'react-spinners'

import useUrl from '@/context/use-url'
import { register } from '@/db/api-auth'
import useFetch from '@/hooks/use-fetch'
import { registerSchema } from '@/schemas/register-schema'
import Error from './error'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'

export default function Register() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const { fetchUser } = useUrl()
  
  const longLink = searchParams.get('createNew')

  const [errors, setErrors] = useState<any>({})
  const [imageName, setImageName] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profileImage: null,
  })

  const {
    loading,
    error,
    fn: fnSignup,
    data
  } = useFetch(register, formData)

  useEffect(() => {
    if (error === null && data) {
      fetchUser()
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ''}`)
    }
  }, [data, error, fetchUser, loading, longLink, navigate])

  useEffect(() => {
    if (formData.profileImage) {
      setImageName((formData.profileImage as File).name)
    } else {
      setImageName(null)
    }
  }, [formData])

  const handleInputChange = (e: FormEvent<HTMLInputElement>) => {
    const { name, value, files } = e.currentTarget

    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }))
  }

  const handleSignup = async () => {
    setErrors([])

    try {
      await registerSchema.validate(formData, { abortEarly: false })
      await fnSignup()
    } catch (error: any) {
      const newErrors: any = {}

      if (error?.inner) {
        error.inner.forEach((err: any) => {
          newErrors[err.path] = err.message
        })

        setErrors(newErrors)
      } else {
        setErrors({ api: error.message })
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Crea una cuenta
        </CardTitle>

        <CardDescription>
          Crea una cuenta si aún no tienes una
        </CardDescription>

        {error && <Error message={error?.message} />}
      </CardHeader>

      <CardContent className='space-y-3'>
        <div className='space-y-1'>
          <Input
            name='name'
            type='text'
            placeholder='John Doe'
            onChange={handleInputChange}
          />

          {errors.name && <Error message={errors.name} />}
        </div>
        
        <div className='space-y-1'>
          <Input
            name='email'
            type='email'
            placeholder='jonhdoe@gmail.com'
            onChange={handleInputChange}
          />

          {errors.email && <Error message={errors.email} />}
        </div>
        
        <div className='space-y-1'>
          <Input
            name='password'
            type='password'
            placeholder='********'
            onChange={handleInputChange}
          />

          {errors.password && <Error message={errors.password} />}
        </div>
        
        <div className='space-y-1'>
          <input
            name='profileImage'
            type='file'
            accept='image/*'
            id='profileImage'
            className='hidden'
            onChange={handleInputChange}
          />

          <label
            htmlFor='profileImage'
            className='flex items-center gap-2 cursor-pointer text-sm text-gray-200 bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 rounded-md py-2 px-4 transition-colors duration-200 border border-white/20 hover:border-white/40'
          >
            <Image className='size-5' /> Selecciona una imagen de perfil
          </label>

          {imageName && (
            <p className='text-xs text-gray-400 mt-1'>
              <span className='font-bold'>Imagen seleccionada: </span>{imageName}
            </p>
          )}
        
          {errors.profileImage && <Error message={errors.profileImage} />}
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={handleSignup} variant='outline' className='cursor-pointer' disabled={loading}>
          {loading ? (
            <BeatLoader size={10} color='#36d7b7' />
          ) : (
            'Registrarse'
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
