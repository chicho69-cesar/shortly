import supabase, { supabaseUrl } from './supabase'

export async function getUrls(userId: string) {
  const { data, error } = await supabase
    .from('urls')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    console.error(error)
    throw new Error('Unable to load URLs')
  }

  return data
}

export async function getUrl(
  { id, userId }: 
  { id: string, userId: string }
) {
  const { data, error } = await supabase
    .from('urls')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error(error)
    throw new Error('Unable to load URL')
  }

  return data
}

export async function getLongUrl(id: string) {
  const { data: shortLinkData, error: shortLinkError } = await supabase
    .from('urls')
    .select('id, original_url')
    .or(`short_url.eq.${id}, custom_url.eq.${id}`)
    .single()

  if (shortLinkError && shortLinkError.code !== 'PGRST116') {
    console.error('Error fetching short link: ', shortLinkError)
    return
  }

  return shortLinkData
}

export async function createUrl({
  title,
  longUrl,
  customUrl,
  userId,
  qrCode
}: {
  title: string,
  longUrl: string,
  customUrl: string,
  userId: string,
  qrCode: File
}) {
  const shortUrl = Math.random().toString(36).substr(2, 6)
  const fileName = `qr-${shortUrl}`

  const { error: storageError } = await supabase.storage
    .from('qrs')
    .upload(fileName, qrCode)

  if (storageError) throw new Error(storageError.message)

  const qr = `${supabaseUrl}/storage/v1/object/public/qrs/${fileName}`

  const { data, error } = await supabase
    .from('urls')
    .insert([
      {
        title,
        user_id: userId,
        original_url: longUrl,
        custom_url: customUrl || null,
        short_url: shortUrl,
        qr,
      },
    ])
    .select()

  if (error) {
    console.error(error)
    throw new Error('Error creating short URL')
  }

  return data
}

export async function deleteUrl(id: string) {
  const { data, error } = await supabase
    .from('urls')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(error)
    throw new Error('Unable to delete Url')
  }

  return data
}
