import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  BarChart3,
  Lightbulb,
  Users,
  Map,
  Settings,
  Zap,
  X,
} from 'lucide-react'
import clsx from 'clsx'

const navItems = [
  { to: '/',            label: 'Dashboard',      icon: LayoutDashboard, end: true },
  { to: '/analytics',  label: 'My Analytics',    icon: BarChart3 },
  { to: '/ideas',      label: 'Content Ideas',   icon: Lightbulb },
  { to: '/competitors',label: 'Competitors',     icon: Users },
  { to: '/strategy',   label: 'Strategy Hub',    icon: Map },
]

export default function Sidebar({ open, onClose }) {
  return (
    <aside
      className={clsx(
        'fixed inset-y-0 left-0 z-30 flex flex-col w-64 bg-dark-800 border-r border-white/5 transition-transform duration-300 lg:static lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">Kofi Kinetics</p>
            <p className="text-[10px] text-gray-500 font-medium mt-0.5">Content Hub</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden text-gray-500 hover:text-white p-1 rounded-lg"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-gray-600">
          Main
        </p>
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-brand-500/15 text-brand-400 border border-brand-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={18}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={isActive ? 'text-brand-400' : ''}
                />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Settings at bottom */}
      <div className="px-3 py-4 border-t border-white/5 shrink-0">
        <NavLink
          to="/settings"
          onClick={onClose}
          className={({ isActive }) =>
            clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
              isActive
                ? 'bg-brand-500/15 text-brand-400 border border-brand-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            )
          }
        >
          <Settings size={18} strokeWidth={2} />
          Settings
        </NavLink>

        {/* Profile chip */}
        <div className="mt-3 flex items-center gap-3 px-3 py-2.5 rounded-xl bg-dark-700 border border-white/5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
            KK
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">@kofi.kinetics</p>
            <p className="text-[10px] text-gray-500 truncate">Fitness Coach</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
