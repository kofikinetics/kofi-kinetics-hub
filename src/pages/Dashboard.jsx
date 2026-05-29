import { useNavigate } from 'react-router-dom'
import {
  TrendingUp, Eye, Heart, Users, ArrowRight,
  Lightbulb, Map, BarChart3, Zap, AlertCircle
} from 'lucide-react'
import { useSettings } from '../hooks/useSettings'

const quickActions = [
  { label: 'View My Analytics',    icon: BarChart3, to: '/analytics', color: 'blue'   },
  { label: 'Generate Content Ideas', icon: Lightbulb, to: '/ideas',    color: 'amber'  },
  { label: 'Scout Competitors',     icon: Users,     to: '/competitors',color: 'purple' },
  { label: 'Open Strategy Hub',     icon: Map,       to: '/strategy',  color: 'green'  },
]

const colorMap = {
  blue:   'bg-blue-500/15 text-blue-400 border-blue-500/20',
  amber:  'bg-amber-500/15 text-amber-400 border-amber-500/20',
  purple: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  green:  'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
}

const tips = [
  { emoji: '🏋️', text: 'Post workout tutorials on TikTok — your male 22–30 audience responds best to form breakdowns.' },
  { emoji: '🔥', text: 'Before/after transformation content drives the highest saves and shares on Instagram Reels.' },
  { emoji: '💬', text: 'CTAs like "Drop a 1️⃣ if you want the full program" in comments boost engagement 3x.' },
  { emoji: '📅', text: 'Consistency beats virality. Aim for 5–7 posts/week across both platforms.' },
  { emoji: '🎯', text: 'Add a clear offer in your bio: "DM me START for a free fitness assessment."' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { settings } = useSettings()
  const hasApiKeys = settings.instagramToken || settings.tiktokToken
  const hasAiKey = !!settings.groqApiKey

  return (
    <div className="space-y-8 animate-slide-up max-w-6xl">
      {/* Welcome banner */}
      <div className="card bg-gradient-to-br from-brand-600/30 via-dark-800 to-dark-800 border-brand-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Zap size={16} className="text-brand-400" />
              <span className="text-xs font-semibold text-brand-400 uppercase tracking-widest">Welcome back</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Hey Kofi 👋</h2>
            <p className="text-gray-400 mt-1 text-sm">
              Your content hub is ready. Let's grow <span className="text-brand-400 font-semibold">@kofi.kinetics</span> and convert followers into clients.
            </p>
          </div>
          <button
            onClick={() => navigate('/strategy')}
            className="btn-primary shrink-0"
          >
            View My Strategy
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Setup prompts */}
      {!hasAiKey && (
        <div className="card border-emerald-500/25 bg-emerald-500/5 flex items-start gap-3">
          <AlertCircle size={18} className="text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-emerald-300">Add your free Groq API key to unlock AI features</p>
            <p className="text-xs text-emerald-400/70 mt-0.5">
              Get a free key at console.groq.com (2 mins, no credit card). Unlocks AI content ideas, competitor analysis, and personalised strategy.
            </p>
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="shrink-0 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition"
          >
            Set up →
          </button>
        </div>
      )}
      {!hasApiKeys && (
        <div className="card border-amber-500/25 bg-amber-500/5 flex items-start gap-3">
          <AlertCircle size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-300">Connect Instagram & TikTok for live analytics</p>
            <p className="text-xs text-amber-400/70 mt-0.5">
              Add your platform tokens in Settings to pull real post performance. All other features work without this.
            </p>
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="shrink-0 text-xs font-semibold text-amber-400 hover:text-amber-300 transition"
          >
            Set up →
          </button>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'IG Followers',  value: hasApiKeys ? '–' : '–',   icon: Users,      delta: null,   note: 'Connect Instagram' },
          { label: 'Avg. Reach',    value: hasApiKeys ? '–' : '–',   icon: Eye,        delta: null,   note: 'Connect Instagram' },
          { label: 'Avg. Engmt.',   value: hasApiKeys ? '–' : '–',   icon: Heart,      delta: null,   note: 'Connect TikTok'   },
          { label: 'Content Ideas', value: '60+',                     icon: Lightbulb,  delta: '+12',  note: 'AI-generated'     },
        ].map(({ label, value, icon: Icon, delta, note }) => (
          <div key={label} className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">{label}</span>
              <Icon size={14} className="text-gray-600" />
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            {delta ? (
              <span className="text-xs text-emerald-400 font-medium">{delta} this week</span>
            ) : (
              <span className="text-xs text-gray-600">{note}</span>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="section-title mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map(({ label, icon: Icon, to, color }) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              className={`card-hover flex flex-col gap-3 cursor-pointer text-left`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colorMap[color]}`}>
                <Icon size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">Click to open →</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Growth Tips */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Quick Growth Tips</h2>
          <span className="badge bg-brand-500/15 text-brand-400 border border-brand-500/20">For male 22–30 audience</span>
        </div>
        <div className="space-y-2">
          {tips.map(({ emoji, text }, i) => (
            <div key={i} className="card-hover flex items-start gap-3">
              <span className="text-xl shrink-0">{emoji}</span>
              <p className="text-sm text-gray-300">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Platform overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-xs font-bold text-white">IG</span>
            </div>
            <h3 className="font-semibold text-white">Instagram</h3>
            <span className="ml-auto badge bg-purple-500/15 text-purple-400 border border-purple-500/20">
              {hasApiKeys ? 'Connected' : 'Not connected'}
            </span>
          </div>
          <div className="space-y-2 text-sm text-gray-400">
            <p>Best content: <span className="text-white font-medium">Reels under 30s</span></p>
            <p>Best time: <span className="text-white font-medium">6–9 PM weekdays</span></p>
            <p>Top format: <span className="text-white font-medium">Workout tutorials + transformations</span></p>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-black to-gray-700 border border-white/10 flex items-center justify-center">
              <span className="text-xs font-bold text-white">TT</span>
            </div>
            <h3 className="font-semibold text-white">TikTok</h3>
            <span className="ml-auto badge bg-gray-500/15 text-gray-400 border border-gray-500/20">
              {settings.tiktokToken ? 'Connected' : 'Not connected'}
            </span>
          </div>
          <div className="space-y-2 text-sm text-gray-400">
            <p>Best content: <span className="text-white font-medium">60–90s educational videos</span></p>
            <p>Best time: <span className="text-white font-medium">7–9 AM & 7–10 PM</span></p>
            <p>Top format: <span className="text-white font-medium">Myth-busting + "Day in my life"</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}
