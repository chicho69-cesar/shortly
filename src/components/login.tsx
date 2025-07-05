/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { BeatLoader } from 'react-spinners'

import useUrl from '@/context/use-url'
import { login } from '@/db/api-auth'
import useFetch from '@/hooks/use-fetch'
import { loginSchema } from '@/schemas/login-schema'
import Error from './error'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'

export default function Login() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const { fetchUser } = useUrl()
  
  const longLink = searchParams.get('createNew')

  const [errors, setErrors] = useState<any>({})
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const {
    loading,
    error,
    fn: fnLogin,
    data
  } = useFetch(login, formData)

  useEffect(() => {
    if (error === null && data) {
      fetchUser()
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ''}`)
    }
  }, [error, data, fetchUser, navigate, longLink])

  const handleInputChange = (e: FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleLogin = async () => {
    setErrors([])
    
    try {
      await loginSchema.validate(formData, { abortEarly: false })
      await fnLogin()
    } catch (e: any) {
      const newErrors: any = {}

      e?.inner?.forEach((err: any) => {
        newErrors[err.path] = err.message
      })

      setErrors(newErrors)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Inicia sesión
        </CardTitle>

        <CardDescription>
          Ingresa tus credenciales para acceder a tu cuenta
        </CardDescription>

        {error && <Error message={error.message} />}
      </CardHeader>

      <CardContent className='space-y-3'>
        <div className='space-y-1'>
          <Input
            name='email'
            type='email'
            placeholder='johndoe@gmail.com'
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
      </CardContent>
      
      <CardFooter>
        <Button onClick={handleLogin} variant='outline' className='cursor-pointer' disabled={loading}>
          {loading ? <BeatLoader size={10} color='#36d7b7' /> : 'Iniciar sesión'}
        </Button>
      </CardFooter>
    </Card>
  )
}
