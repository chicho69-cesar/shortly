import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import Login from '@/components/login'
import Register from '@/components/register'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useUrl from '@/context/use-url'

export default function Auth() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const { isAuthenticated, loading } = useUrl()
  
  const longLink = searchParams.get('createNew')

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ''}`)
    }
  }, [isAuthenticated, loading, longLink, navigate])

  return (
    <div className='mt-20 pb-12 flex flex-col items-center gap-10'>
      <h1 className='text-5xl font-extrabold'>
        {searchParams.get('createNew')
          ? '¡Espera! Primero inicia sesión...'
          : 'Iniciar sesión / Registrarse'}
      </h1>
      
      <Tabs defaultValue='login' className='w-[90%] max-w-2xl'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='login'>
            Iniciar sesión
          </TabsTrigger>

          <TabsTrigger value='register'>
            Registrarse
          </TabsTrigger>
        </TabsList>

        <TabsContent value='login'>
          <Login />
        </TabsContent>

        <TabsContent value='register'>
          <Register />
        </TabsContent>
      </Tabs>
    </div>
  )
}
