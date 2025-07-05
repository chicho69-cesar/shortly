import { Check, Copy, Download, LinkIcon, Trash } from 'lucide-react'
import { Link } from 'react-router'
import { BeatLoader } from 'react-spinners'

import { SITE_URL } from '@/constants/urls'
import { deleteUrl } from '@/db/api-urls'
import useFetch from '@/hooks/use-fetch'
import type { DBUrl } from '@/types/urls'
import { Button } from './ui/button'
import { useState } from 'react'

interface LinkCardProps {
  url: DBUrl
  fetchUrls: () => Promise<void>
}

export default function LinkCard({ fetchUrls, url }: LinkCardProps) {
  const [isCopying, setIsCopying] = useState(false)

  const {
    loading: loadingDelete,
    fn: fnDelete
  } = useFetch(deleteUrl, url.id)

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
    const imageUrl = url.qr
    const fileName = url.title

    const anchor = document.createElement('a')
    anchor.href = imageUrl || ''
    anchor.target = '_blank'
    anchor.download = fileName

    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
  }

  const handleDelete = async () => {
    try {
      await fnDelete()
      await fetchUrls()
    } catch (error) {
      console.error('Failed to delete URL:', error)
    }
  }

  return (
    <div className='flex flex-col md:flex-row gap-5 border p-4 bg-gray-900 rounded-lg'>
      <img
        src={url.qr}
        className='h-32 object-contain ring ring-blue-500 self-start'
        alt='qr code'
      />

      <Link to={`/link/${url.id}`} className='flex flex-col flex-1'>
        <span className='text-3xl font-extrabold hover:underline cursor-pointer'>
          {url.title}
        </span>

        <span className='text-2xl text-blue-400 font-bold hover:underline cursor-pointer'>
          {SITE_URL}/{url.custom_url ? url.custom_url : url.short_url}
        </span>

        <span className='flex items-center gap-1 hover:underline cursor-pointer'>
          <LinkIcon className='p-1' />
          {url.original_url}
        </span>

        <span className='flex items-end font-extralight text-sm flex-1'>
          {new Date(url.created_at!).toLocaleString()}
        </span>
      </Link>

      <div className='flex gap-2'>
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
          {loadingDelete ? <BeatLoader size={5} color='white' /> : <Trash />}
        </Button>
      </div>
    </div>
  )
}
