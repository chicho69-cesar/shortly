/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useParams } from 'react-router'
import { BarLoader } from 'react-spinners'

import { addClicks } from '@/db/api-clicks'
import { getLongUrl } from '@/db/api-urls'
import useFetch from '@/hooks/use-fetch'

export default function RedirectLink() {
  const { id } = useParams()

  const {
    loading,
    data,
    fn
  } = useFetch(getLongUrl, id)

  const {
    loading: loadingStats,
    fn: fnStats
  } = useFetch(addClicks, { id: data?.id, originalUrl: data?.original_url })

  useEffect(() => {
    fn()
  }, [])

  useEffect(() => {
    if (!loading && data) {
      fnStats()
    }
  }, [loading])

  if (loading || loadingStats) {
    return (
      <div className='w-[90%] max-w-4xl mx-auto mt-20'>
        <BarLoader width={'100%'} color='#36d7b7' />
        <br />

        Redirecting...
      </div>
    )
  }

  return null
}
