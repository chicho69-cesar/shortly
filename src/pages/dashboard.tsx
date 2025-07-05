/* eslint-disable react-hooks/exhaustive-deps */
import { Filter } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { BarLoader } from 'react-spinners'

import CreateLink from '@/components/create-link'
import Error from '@/components/error'
import LinkCard from '@/components/link-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import useUrl from '@/context/use-url'
import { getClicksForUrls } from '@/db/api-clicks'
import { getUrls } from '@/db/api-urls'
import useFetch from '@/hooks/use-fetch'

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const { user } = useUrl()
  
  const {
    loading,
    error,
    data: urls,
    fn: fnUrls
  } = useFetch(getUrls, user?.id)
  
  const {
    loading: loadingClicks,
    data: clicks,
    fn: fnClicks,
  } = useFetch(getClicksForUrls, urls?.map((url) => url.id))

  useEffect(() => {
    fnUrls()
  }, [])

  useEffect(() => {
    if (urls?.length) {
      fnClicks()
    }
  }, [urls?.length])

  const filteredUrls = useMemo(() => urls?.filter((url) =>
    url.title.toLowerCase().includes(searchQuery.toLowerCase())
  ), [urls, searchQuery])

  return (
    <div className='flex flex-col gap-8 w-[90%] max-w-4xl mx-auto mt-16 pb-12'>
      {(loading || loadingClicks) && (
        <BarLoader width={'100%'} color='#36d7b7' />
      )}

      <div className='grid grid-cols-2 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle className='text-center'>
              Total de links creados
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className='text-5xl font-bold text-center'>
              {urls?.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-center'>
              Total de clicks
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className='text-5xl font-bold text-center'>
              {clicks?.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className='flex justify-between'>
        <h1 className='text-4xl font-extrabold'>
          Mis Links
        </h1>

        <CreateLink />
      </div>

      <div className='relative'>
        <Input
          type='text'
          placeholder='Filtrar links...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Filter className='absolute top-2 right-2 p-1' />
      </div>

      {error && <Error message={error?.message} />}
      
      {(filteredUrls || []).map((url, i) => (
        <LinkCard key={i} url={url} fetchUrls={fnUrls} />
      ))}
    </div>
  )
}
