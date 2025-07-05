import { UAParser } from 'ua-parser-js'
import supabase from './supabase'

// export async function getClicks() {
//   let { data, error } = await supabase.from('clicks').select('*')

//   if (error) {
//     console.error(error)
//     throw new Error('Unable to load Stats')
//   }

//   return data
// }

export async function getClicksForUrls(urlIds: string[]) {
  const { data, error } = await supabase
    .from('clicks')
    .select('*')
    .in('url_id', urlIds)

  if (error) {
    console.error(error)
    throw new Error('Unable to load Clicks')
  }

  return data
}

export async function getClicksForUrl(urlId: string) {
  const { data, error } = await supabase
    .from('clicks')
    .select('*')
    .eq('url_id', urlId)

  if (error) {
    console.error(error)
    throw new Error('Unable to load Clicks for URL')
  }

  return data
}

export async function addClicks(
  { id, originalUrl }:
  { id: string, originalUrl: string }
) {
  try {
    const parser = new UAParser()
    const result = parser.getResult()
    const device = result.device.type || 'desktop'

    const response = await fetch('https://ipapi.co/json/')
    const locationData = await response.json()
    const { city, country_name: country } = locationData

    await supabase.from('clicks').insert({
      url_id: id,
      city: city || 'Unknown',
      country: country || 'Unknown',
      device: device,
    })

    window.location.href = originalUrl
  } catch (error) {
    console.error('Error adding click:', error)
    throw new Error('Unable to add Click')
  }
}
