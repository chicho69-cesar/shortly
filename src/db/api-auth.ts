import supabase, { supabaseUrl } from './supabase'

export async function login(
  { email, password }:
  { email: string, password: string }
) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function register(
  { name, email, password, profileImage }:
  { name: string, email: string, password: string, profileImage: File }
) {
  const fileName = `dp-${name.split(' ').join('-')}-${Date.now()}`

  const { error: storageError } = await supabase.storage
    .from('profile-pictures')
    .upload(fileName, profileImage)

  if (storageError) {
    throw new Error(storageError.message)
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        profileImage: `${supabaseUrl}/storage/v1/object/public/profile-pictures/${fileName}`
      }
    }
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function getCurrentUser() {
  const { data: session, error } = await supabase.auth.getSession()
  if (!session.session) return null

  if (error) {
    throw new Error(error.message)
  }

  return session.session.user
}

export async function logout() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(error.message)
  }
}
