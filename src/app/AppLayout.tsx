import { Outlet } from 'react-router'

export function AppLayout() {
  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-5xl px-6 py-12">
        <Outlet />
      </main>
    </div>
  )
}
