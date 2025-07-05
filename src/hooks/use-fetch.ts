/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'

export default function useFetch<T>(callback: (...args: any) => Promise<T>, options: any = {}) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any | null>(null)

  const fn = async (...args: any) => {
    setLoading(true)
    setError(null)

    try {
      const response = await callback(options, ...args)

      setData(response)
      setError(null)
    } catch (error: any) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  return {
    data,
    loading,
    error,
    fn
  }
}
