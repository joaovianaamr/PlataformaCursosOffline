import { Outlet } from 'react-router-dom'
import { NavBar } from './NavBar'
import { Breadcrumb } from './Breadcrumb'

export function AppShell() {
  return (
    <div className="min-h-screen bg-bg">
      <NavBar />
      <Breadcrumb />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <Outlet />
      </main>
    </div>
  )
}
