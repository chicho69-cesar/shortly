import { useEffect, type ReactNode } from 'react'

import { getCurrentUser } from '@/db/api-auth'
import { UrlContext } from './url-context'
import useFetch from '@/hooks/use-fetch'

interface UrlProviderProps {
  children?: ReactNode | ReactNode[]
}

export default function UrlProvider({ children }: UrlProviderProps) {
  const { data: user, loading, fn: fetchUser } = useFetch(getCurrentUser)

  const isAuthenticated = user?.role === 'authenticated'

  useEffect(() => {
    fetchUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <UrlContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        fetchUser
      }}
    >
      {children}
    </UrlContext.Provider>
  )
}
