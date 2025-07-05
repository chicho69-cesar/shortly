import useUrl from '@/context/use-url'
import { useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { BarLoader } from 'react-spinners'

interface RequireAuthProps {
  children?: ReactNode | ReactNode[]
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const navigate = useNavigate()
  const { loading, isAuthenticated } = useUrl()

  useEffect(() => {
    if (!isAuthenticated && loading === false) navigate('/auth')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, loading])

  if (loading) return <BarLoader width={'100%'} color='#36d7b7' />

  return children
}
