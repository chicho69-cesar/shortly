import { LinkIcon, LogOut } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { BarLoader } from 'react-spinners'

import useUrl from '@/context/use-url'
import { logout } from '@/db/api-auth'
import useFetch from '@/hooks/use-fetch'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'

export default function Header() {
  const { loading, fn: fnLogout } = useFetch(logout)
  const navigate = useNavigate()

  const { user, fetchUser } = useUrl()

  const handleLogout = () => {
    fnLogout()
      .then(() => {
        fetchUser()
        navigate('/auth')
      })
  }

  return (
    <>
      <nav className='p-4 flex justify-between items-center'>
        <Link to='/'>
          <img src='/favicon.png' className='h-16' alt='Shortly Logo' />
        </Link>

        <div className='flex gap-4'>
          {!user ? (
            <Button
              onClick={() => navigate('/auth')}
              variant='outline'
              className='cursor-pointer'
            >
              Iniciar sesión
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className='w-10 rounded-full overflow-hidden'>
                <Avatar className='cursor-pointer'>
                  <AvatarImage src={user?.user_metadata?.profileImage} />
                  <AvatarFallback>NA</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuLabel>
                  {user?.user_metadata?.name}
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem>
                  <Link to='/dashboard' className='flex'>
                    <LinkIcon className='mr-2 h-4 w-4' />
                    Mis links
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleLogout}
                  className='text-red-400'
                >
                  <LogOut className='mr-2 h-4 w-4' />
                  <span>
                    Cerrar sesión
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>

      {loading && <BarLoader className='mb-4' width={'100%'} color='#36d7b7' />}
    </>
  )
}
