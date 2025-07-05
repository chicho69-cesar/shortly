/* eslint-disable react-hooks/exhaustive-deps */
import { Check, Copy, Download, LinkIcon, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { BarLoader, BeatLoader } from 'react-spinners'

import DeviceStats from '@/components/device-stats'
import LocationStats from '@/components/location-stats'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SITE_URL } from '@/constants/urls'
import useUrl from '@/context/use-url'
import { getClicksForUrl } from '@/db/api-clicks'
import { deleteUrl, getUrl } from '@/db/api-urls'
import useFetch from '@/hooks/use-fetch'

export default function Link() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useUrl()

  const [isCopying, setIsCopying] = useState(false)

  const {
    loading,
    data: url,
    fn,
    error,
  } = useFetch(getUrl, { id, userId: user?.id })

  const {
    loading: loadingStats,
    data: stats,
    fn: fnStats,
  } = useFetch(getClicksForUrl, id)

  const {
    loading: loadingDelete,
    fn: fnDelete
  } = useFetch(deleteUrl, id)

  useEffect(() => {
    fn()
  }, [])

  useEffect(() => {
    if (!error && loading === false) {
      fnStats()
    }
  }, [loading, error])

  const handleCopy = async () => {
    setIsCopying(true)

    try {
      await navigator.clipboard.writeText(`${SITE_URL}/${url.short_url}`)
      setTimeout(() => setIsCopying(false), 2000)
    } catch (error) {
      console.error('Failed to copy URL:', error)
      setIsCopying(false)
    }
  }

  const handleDownloadImage = () => {
    const imageUrl = url?.qr
    const fileName = url?.title

    const anchor = document.createElement('a')
    anchor.href = imageUrl
    anchor.target = '_blank'
    anchor.download = fileName

    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
  }

  const handleDelete = async () => {
    try {
      await fnDelete()
      navigate('/dashboard')
    } catch (error) {
      console.error('Failed to delete URL:', error)
    }
  }

  if (error) {
    navigate('/dashboard')
  }

  let link = ''

  if (url) {
    link = url?.custom_url ? url?.custom_url : url.short_url
  }

  return (
    <div className='w-[90%] max-w-6xl mx-auto my-12'>
      {(loading || loadingStats) && (
        <BarLoader className='mb-4' width={'100%'} color='#36d7b7' />
      )}

      <div className='flex flex-col gap-8 sm:flex-row justify-between items-start'>
        <div className='rounded-lg sm:w-2/5 border p-4 bg-gray-900'>
          <div className='flex w-full justify-end items-center mb-2 gap-2'>
            <Button
              variant='ghost'
              onClick={handleCopy}
            >
              {isCopying ? <Check /> : <Copy />}
            </Button>

            <Button variant='ghost' onClick={handleDownloadImage}>
              <Download />
            </Button>

            <Button
              variant='ghost'
              onClick={handleDelete}
              disabled={loadingDelete}
            >
              {loadingDelete ? (
                <BeatLoader size={5} color='white' />
              ) : (
                <Trash />
              )}
            </Button>
          </div>

          <h1 className='text-6xl mb-4 font-extrabold'>
            {url?.title}
          </h1>

          <div className='w-full flex flex-col gap-1 mb-4'>
            <a
              href={`${SITE_URL}/${link}`}
              target='_blank'
              className='text-xl sm:text-2xl text-blue-400 font-bold hover:underline cursor-pointer'
            >
              {SITE_URL}/{link}
            </a>
  
            <a
              href={url?.original_url}
              target='_blank'
              className='flex items-center gap-1 hover:underline cursor-pointer'
            >
              <LinkIcon className='p-1' />
              {url?.original_url}
            </a>
  
            <span className='flex items-end font-extralight text-sm'>
              {new Date(url?.created_at).toLocaleString()}
            </span>
          </div>

          <img
            src={url?.qr}
            className='w-full self-center sm:self-start ring ring-blue-500 p-1 object-contain'
            alt='qr code'
          />
        </div>

        <Card className='sm:w-3/5'>
          <CardHeader>
            <CardTitle className='text-4xl font-extrabold'>
              Estadísticas
            </CardTitle>
          </CardHeader>

          {stats && stats.length ? (
            <CardContent className='flex flex-col gap-6'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-center'>
                    Total de clicks
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className='text-5xl font-bold text-center'>
                    {stats?.length}
                  </p>
                </CardContent>
              </Card>

              <CardTitle>
                Estadísticas por ubicación
              </CardTitle>
              
              <LocationStats stats={stats} />
              
              <CardTitle>
                Estadísticas por dispositivo
              </CardTitle>

              <DeviceStats stats={stats} />
            </CardContent>
          ) : (
            <CardContent>
              {loadingStats === false
                ? 'No hay estadísticas disponibles para este link.'
                : 'Cargando estadísticas...'}
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
