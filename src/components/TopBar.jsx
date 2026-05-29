import { Menu, Bell, RefreshCw } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const titles = {
  '/':            { title: 'Dashboard',          sub: 'Overview of your content performance' },
  '/analytics':   { title: 'My Analytics',       sub: 'Instagram & TikTok performance data' },
  '/ideas':       { title: 'Content Ideas',       sub: 'AI-generated ideas based on your top content' },
  '/competitors': { title: 'Competitor Intel',    sub: 'Track and clone top fitness accounts' },
  '/strategy':    { title: 'Strategy Hub',        sub: '30-day content plan & conversion funnel' },
  '/settings':    { title: 'Settings',            sub: 'Manage API keys and preferences' },
}

export default function TopBar({ onMenuClick }) {
  const { pathname } = useLocation()
  const page = titles[pathname] || titles['/']

  return (
    <header className="h-16 bg-dark-800 border-b border-white/5 flex items-center gap-4 px-4 lg:px-8 shrink-0">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-gray-400 hover:text-white p-1.5 rounded-lg transition"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1 min-w-0">
        <h1 className="text-base font-bold text-white truncate">{page.title}</h1>
        <p className="text-xs text-gray-500 truncate hidden sm:block">{page.sub}</p>
      </div>

      <div className="flex items-center gap-2">
        <button className="btn-ghost text-gray-500 hidden sm:flex">
          <RefreshCw size={15} />
          Refresh
        </button>
        <button className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-500 rounded-full"></span>
        </button>
      </div>
    </header>
  )
}
