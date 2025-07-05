import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Landing() {
  const navigate = useNavigate()
  const [longUrl, setLongUrl] = useState('')

  const handleShorten = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (longUrl) {
      navigate(`/auth?createNew=${longUrl}`)
    }
  }

  return (
    <div className='flex flex-col items-center pb-10'>
      <h2 className='my-10 sm:my-8 text-3xl sm:text-6xl lg:text-7xl text-white text-center font-extrabold'>
        ¡El único shortener de Links <br /> que vas a necesitar! 👇
      </h2>

      <form
        onSubmit={handleShorten}
        className='sm:h-14 flex flex-col sm:flex-row w-full md:w-2/4 gap-2'
      >
        <Input
          type='url'
          placeholder='Escribe tu URL aquí...'
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          className='h-full flex-1 py-4 px-4'
        />

        <Button type='submit' className='h-full cursor-pointer' variant='destructive'>
          Acortar!
        </Button>
      </form>

      <img
        src='/banner.png'
        className='w-4xl rounded-t-3xl my-11 object-cover shadow mask-b-from-60%'
      />

      <Accordion type='multiple' className='w-[90%] max-w-4xl'>
        <AccordionItem value='item-1'>
          <AccordionTrigger className='text-lg'>
            ¿Cómo funciona el acortador de URLs Shortly?
          </AccordionTrigger>

          <AccordionContent>
            Cuando ingresas una URL larga, nuestro sistema genera una versión
            más corta de esa URL. Esta URL acortada redirige a la URL larga 
            original cuando se accede a ella.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value='item-2'>
          <AccordionTrigger className='text-lg'>
            ¿Necesito una cuenta para usar la aplicación?
          </AccordionTrigger>

          <AccordionContent>
            Sí. Crear una cuenta te permite gestionar tus URLs, ver
            analíticas y personalizar tus URLs cortas.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value='item-3'>
          <AccordionTrigger className='text-lg'>
            ¿Qué analíticas están disponibles para mis URLs acortadas?
          </AccordionTrigger>

          <AccordionContent>
            Puedes ver el número de clics, datos de geolocalización de los clics
            y tipos de dispositivos (móvil/escritorio) para cada una de tus URLs
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
