import Header from '@/components/header'
import { Outlet } from 'react-router'

export default function AppLayout() {
  return (
    <>
      <div className="fixed inset-0 -z-10 h-full w-full bg-neutral-900 bg-[linear-gradient(to_right,#23272f_1px,transparent_1px),linear-gradient(to_bottom,#23272f_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#2a4745,transparent)]"></div>
      </div>
      
      <div>
        <main className='min-h-screen container'>
          <Header />
          <Outlet />
        </main>
      </div>
    </>
  )
}
