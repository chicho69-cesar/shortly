import { useContext } from 'react'
import { UrlContext } from './url-context'

export default function useUrl() {
  return useContext(UrlContext)
}
