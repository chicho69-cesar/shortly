/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { BeatLoader } from 'react-spinners'
import { QrCode } from 'lucide-react'
import { QRCode } from 'react-qrcode-logo'

import { SITE_URL } from '@/constants/urls'
import useUrl from '@/context/use-url'
import { createUrl } from '@/db/api-urls'
import useFetch from '@/hooks/use-fetch'
import { linkSchema } from '@/schemas/link-schema'
import Error from './error'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Input } from './ui/input'

export default function CreateLink() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const { user } = useUrl()
  const ref = useRef<any | null>(null)

  const longLink = searchParams.get('createNew')

  const [errors, setErrors] = useState<any>({})
  const [file, setFile] = useState<File | null>(null)
  const [formValues, setFormValues] = useState({
    title: '',
    longUrl: longLink ? longLink : '',
    customUrl: '',
  })

  const {
    loading,
    error,
    data,
    fn: fnCreateUrl,
  } = useFetch(createUrl, { ...formValues, qrCode: file, userId: user?.id })

  useEffect(() => {
    if (error === null && data) {
      navigate(`/link/${data[0].id}`)
    }
  }, [error, data, navigate])

  useEffect(() => {
    const generateQRCode = async () => {
      if (formValues.longUrl) {
        try {
          const canvas = ref.current.canvasRef.current
          const blob: any = await new Promise((resolve) => canvas.toBlob(resolve))
          const fileBlob = new File([blob], `${formValues.title || 'link'}.png`, {
            type: 'image/png',
          })

          setFile(fileBlob)
        } catch (e) {
          console.error('Error generating QR code:', e)
        }
      }
    }

    generateQRCode()
  }, [formValues.longUrl, formValues.title])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value,
    })
  }

  const createNewLink = async () => {
    setErrors([])
    
    try {
      await linkSchema.validate(formValues, { abortEarly: false })
      await fnCreateUrl()
    } catch (e: any) {
      const newErrors: Record<string, string> = {}

      e?.inner?.forEach((err: any) => {
        newErrors[err.path] = err.message
      })

      setErrors(newErrors)
    }
  }

  return (
    <Dialog
      defaultOpen={!!longLink}
      onOpenChange={(res) => {
        if (!res) setSearchParams({});
      }}
    >
      <DialogTrigger asChild>
        <Button variant='destructive' className='cursor-pointer hover:bg-red-600'>
          <QrCode className='size-4 mr-2' />
          Crear link
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='font-bold text-2xl'>
            Crear nuevo link
          </DialogTitle>
        </DialogHeader>

        {formValues?.longUrl && (
          <QRCode
            ref={ref}
            size={250}
            value={formValues?.longUrl}
          />
        )}

        <Input
          id='title'
          placeholder='Nombre del link'
          value={formValues.title}
          onChange={handleChange}
        />

        {errors.title && <Error message={errors.title} />}
        
        <Input
          id='longUrl'
          placeholder='URL original'
          value={formValues.longUrl}
          onChange={handleChange}
        />

        {errors.longUrl && <Error message={errors.longUrl} />}
        
        <div className='flex items-center gap-2'>
          <Card className='p-2'>{SITE_URL}</Card> /
          <Input
            id='customUrl'
            placeholder='URL personalizada (opcional)'
            value={formValues.customUrl}
            onChange={handleChange}
          />
        </div>

        {error && <Error message={errors.message} />}
        
        <DialogFooter className='sm:justify-start'>
          <Button
            type='button'
            variant='destructive'
            onClick={createNewLink}
            disabled={loading}
            className='cursor-pointer hover:bg-red-600'
          >
            {loading ? <BeatLoader size={10} color='white' /> : 'Crear'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
