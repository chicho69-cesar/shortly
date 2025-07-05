export interface DBUrl {
  id: number
  created_at?: string
  original_url: string
  short_url: string
  custom_url?: string
  user_id: string
  title: string
  qr?: string
}
