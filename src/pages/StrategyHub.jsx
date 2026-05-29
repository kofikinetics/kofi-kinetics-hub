import { useState } from 'react'
import {
  Map, Sparkles, RefreshCw, AlertCircle, Calendar,
  Target, TrendingUp, MessageCircle, ArrowRight,
  Instagram, Share2, CheckCircle
} from 'lucide-react'
import { useSettings } from '../hooks/useSettings'
import { generateStrategy } from '../services/claude'
import clsx from 'clsx'

// Default static strategy (works without API key)
const DEFAULT_STRATEGY = {
  strategyOverview: 'Focus on becoming the go-to fitness coach for driven young men (22–30) who want real results without a gym. Mix educational content with personal authenticity to build trust, then convert through a simple DM-based sales process. Consistency and specificity beat virality every time.',
  contentMix: {
    educational: 35,
    motivational: 20,
    transformation: 20,
    personal: 15,
    promotional: 10,
  },
  conversionFunnel: [
    {
      stage: '1. Awareness',
      goal: 'Get seen by new people',
      contentType: 'Viral Reels & TikToks (workout tips, myths, quick wins)',
      example: '"The 3 biggest workout mistakes skinny guys make" — hooks algorithm and ideal clients',
    },
    {
      stage: '2. Engagement',
      goal: 'Build trust & relationship',
      contentType: 'Carousels, Q&As, Stories, polls',
      example: '"Reply to this with your #1 fitness struggle" — starts the conversation',
    },
    {
      stage: '3. Lead',
      goal: 'Move them to your DMs',
      contentType: 'Client transformations, free value offers',
      example: '"Comment PLAN for a free 7-day workout template" — builds list & trust',
    },
    {
      stage: '4. Client',
      goal: 'Convert to paying client',
      contentType: 'DM conversation → discovery call → offer',
      example: 'After sending freebie: "I noticed X about your goals, I think my coaching could be a good fit. Want to jump on a quick call?"',
    },
  ],
  weeklySchedule: {
    Monday:    { platform: 'TikTok',    format: 'Educational Reel',    topic: 'Form fix / common mistake',         time: '7:00 AM' },
    Tuesday:   { platform: 'Instagram', format: 'Carousel',            topic: 'Training tip (3–5 slides)',          time: '6:30 PM' },
    Wednesday: { platform: 'Both',      format: 'Transformation Reel', topic: 'Client before/after + story',        time: '7:00 PM' },
    Thursday:  { platform: 'Instagram', format: 'Story Series',        topic: 'Behind-the-scenes / Q&A',            time: '12:00 PM' },
    Friday:    { platform: 'TikTok',    format: 'Motivational Reel',   topic: 'End-of-week energy / mindset',       time: '6:00 PM' },
    Saturday:  { platform: 'Both',      format: 'Lifestyle Reel',      topic: 'Your own workout / diet',            time: '9:00 AM' },
    Sunday:    { platform: 'Instagram', format: 'Value Carousel',      topic: 'Weekly tip recap / prep for week',   time: '5:00 PM' },
  },
  growthHacks: [
    'Use "Comment X to get Y" CTAs in every post — DM automation tools (ManyChat) fulfil the offer and start a convo automatically.',
    'Collaborate with supplement, gym apparel, or wellness brands for paid posts — adds income + exposes you to their audience.',
    'Reply to EVERY comment within the first hour of posting — the algorithm rewards it and your followers notice.',
    'Stitch viral fitness debates on TikTok with your expert take — borrows the viral post\'s momentum.',
    'Post a "responding to hate comments" video — wildly high engagement and shows confidence.',
    'Run a free 5-day challenge via Instagram Stories — gets people invested and primes them to buy coaching.',
  ],
  monetizationPath: [
    'Day 1–30: Build trust. Post consistently, engage deeply, give away free value. Never pitch. Goal: 500–1000 engaged followers.',
    'Day 30–60: Launch a low-ticket offer. A $27–$47 workout plan PDF or program. Tests buying intent without high pressure.',
    'Day 60–90: Introduce 1-to-1 coaching waitlist. "Limited spots, DM me COACH to apply." Social scarcity drives action.',
    'Day 90+: Systematise. Raise prices, add group coaching, create a signature program. Coaching ≥ $300/month per client.',
  ],
  bioOptimization: {
    instagram: '🏋️ Online Fitness Coach | Helping men 22–30 build their best physique 💪\n📲 DM "START" for a free fitness assessment\n⬇️ Free workout plan',
    tiktok: '🔥 Fitness coach for men | Real results, no BS\n💬 DM me "PLAN" on IG for free training template\n@kofi.kinetics on IG',
  },
  monthlyGoals: {
    followers: '+500–1,000 net new followers',
    dmConversions: '5–15 coaching enquiries per month',
    contentPieces: 28,
  },
}

const MIX_COLORS = {
  educational:   'bg-blue-500',
  motivational:  'bg-amber-500',
  transformation:'bg-brand-500',
  personal:      'bg-purple-500',
  promotional:   'bg-emerald-500',
}

const MIX_LABELS = {
  educational:   'Educational',
  motivational:  'Motivational',
  transformation:'Transformation',
  personal:      'Personal/BTS',
  promotional:   'Promotional',
}

const FUNNEL_COLORS = ['bg-blue-500/20 border-blue-500/30 text-blue-300', 'bg-purple-500/20 border-purple-500/30 text-purple-300', 'bg-brand-500/20 border-brand-500/30 text-brand-300', 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300']

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const PLATFORM_BADGE = {
  Instagram: 'bg-pink-500/20 text-pink-400 border-pink-500/20',
  TikTok:    'bg-gray-500/20 text-gray-300 border-gray-500/20',
  Both:      'bg-brand-500/20 text-brand-400 border-brand-500/20',
}

export default function StrategyHub() {
  const { settings } = useSettings()
  const [strategy, setStrategy] = useState(DEFAULT_STRATEGY)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [generated, setGenerated] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [copiedBio, setCopiedBio] = useState(null)

  const handleGenerate = async () => {
    if (!settings.groqApiKey) {
      setError('Add your free Groq API key in Settings to generate a personalised strategy.')
      return
    }
    setLoading(true); setError(null)
    try {
      const result = await generateStrategy(settings.groqApiKey, {
        handle: settings.handle,
        niche: settings.niche,
        audience: settings.audience,
        platforms: ['Instagram', 'TikTok'],
      })
      setStrategy(result)
      setGenerated(true)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const copyBio = (platform) => {
    navigator.clipboard.writeText(strategy.bioOptimization[platform.toLowerCase()])
    setCopiedBio(platform)
    setTimeout(() => setCopiedBio(null), 2000)
  }

  const TABS = [
    { id: 'overview',    label: 'Overview'    },
    { id: 'funnel',      label: 'Sales Funnel' },
    { id: 'schedule',    label: 'Weekly Plan'  },
    { id: 'growth',      label: 'Growth Hacks' },
    { id: 'monetize',    label: 'Monetization' },
    { id: 'bio',         label: 'Bios'         },
  ]

  return (
    <div className="space-y-6 max-w-5xl animate-slide-up">
      {/* Generate banner */}
      <div className="card bg-gradient-to-br from-brand-600/20 via-dark-800 to-dark-800 border-brand-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Map size={15} className="text-brand-400" />
              <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">Strategy Hub</span>
              {generated && <span className="badge bg-brand-500/15 text-brand-400 border border-brand-500/20 ml-2">AI-personalised ✓</span>}
            </div>
            <p className="text-gray-300 text-sm">
              {generated
                ? 'Your personalised strategy is ready. Use it as your content operating system.'
                : 'Showing a default strategy for fitness coaches. Click below to generate a personalised version with AI.'}
            </p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="btn-primary shrink-0 disabled:opacity-50"
          >
            {loading
              ? <><RefreshCw size={14} className="animate-spin" /> Generating…</>
              : <><Sparkles size={14} /> {generated ? 'Regenerate' : 'Personalise with AI'}</>
            }
          </button>
        </div>
        {error && (
          <div className="flex items-start gap-2 mt-3 p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
            <AlertCircle size={13} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 p-1 bg-dark-800 rounded-2xl border border-white/5">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={clsx(
              'px-3 py-2 rounded-xl text-xs font-semibold transition-all flex-1 sm:flex-none',
              activeTab === t.id ? 'bg-brand-500 text-white' : 'text-gray-400 hover:text-white'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-5 animate-slide-up">
          <div className="card">
            <h3 className="font-semibold text-white mb-3">Strategy Overview</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{strategy.strategyOverview}</p>
          </div>

          {/* Monthly goals */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Follower Growth',   value: strategy.monthlyGoals?.followers          },
              { label: 'DM Enquiries',       value: strategy.monthlyGoals?.dmConversions      },
              { label: 'Content Pieces',     value: strategy.monthlyGoals?.contentPieces + '/mo' },
            ].map(({ label, value }) => (
              <div key={label} className="stat-card text-center">
                <p className="text-xs text-gray-500">{label}</p>
                <p className="font-bold text-white text-lg mt-1">{value}</p>
              </div>
            ))}
          </div>

          {/* Content mix */}
          <div className="card space-y-4">
            <h3 className="font-semibold text-white">Content Mix</h3>
            <div className="flex h-4 rounded-full overflow-hidden gap-0.5">
              {Object.entries(strategy.contentMix || {}).map(([key, pct]) => (
                <div
                  key={key}
                  className={clsx('h-full rounded-sm transition-all', MIX_COLORS[key])}
                  style={{ width: `${pct}%` }}
                  title={`${MIX_LABELS[key]}: ${pct}%`}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(strategy.contentMix || {}).map(([key, pct]) => (
                <div key={key} className="flex items-center gap-2 text-xs">
                  <div className={clsx('w-2.5 h-2.5 rounded-full shrink-0', MIX_COLORS[key])} />
                  <span className="text-gray-400">{MIX_LABELS[key]}</span>
                  <span className="ml-auto text-white font-semibold">{pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FUNNEL */}
      {activeTab === 'funnel' && (
        <div className="space-y-4 animate-slide-up">
          <div>
            <h2 className="section-title">Follower → Client Conversion Funnel</h2>
            <p className="section-sub mt-1">Tailored for your male 22–30 audience on Instagram & TikTok.</p>
          </div>
          <div className="space-y-3">
            {strategy.conversionFunnel?.map((stage, i) => (
              <div key={i} className={clsx('card border', FUNNEL_COLORS[i])}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={clsx('w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border', FUNNEL_COLORS[i])}>
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-bold text-white">{stage.stage}</p>
                    <p className="text-xs text-gray-500">{stage.goal}</p>
                  </div>
                  {i < 3 && <ArrowRight size={16} className="ml-auto text-gray-600" />}
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Content Type</p>
                    <p className="text-sm text-gray-300">{stage.contentType}</p>
                  </div>
                  <div className="p-3 bg-dark-900/50 rounded-xl border border-white/5">
                    <p className="text-xs text-gray-500 mb-1">💡 Example</p>
                    <p className="text-xs text-gray-300 italic">"{stage.example}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SCHEDULE */}
      {activeTab === 'schedule' && (
        <div className="space-y-4 animate-slide-up">
          <div>
            <h2 className="section-title">Weekly Content Schedule</h2>
            <p className="section-sub mt-1">Optimised posting times for maximum reach with your audience.</p>
          </div>
          <div className="space-y-2">
            {DAYS.map(day => {
              const slot = strategy.weeklySchedule?.[day]
              if (!slot) return null
              return (
                <div key={day} className="card flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="w-24 shrink-0">
                    <p className="font-semibold text-white text-sm">{day}</p>
                    <p className="text-xs text-gray-500">{slot.time}</p>
                  </div>
                  <span className={clsx('badge border text-xs w-fit', PLATFORM_BADGE[slot.platform] || PLATFORM_BADGE['Both'])}>
                    {slot.platform}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium">{slot.format}</p>
                    <p className="text-xs text-gray-500 truncate">{slot.topic}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* GROWTH HACKS */}
      {activeTab === 'growth' && (
        <div className="space-y-4 animate-slide-up">
          <div>
            <h2 className="section-title">Growth Hacks</h2>
            <p className="section-sub mt-1">Specific tactics for growing with males 22–30.</p>
          </div>
          <div className="space-y-3">
            {strategy.growthHacks?.map((hack, i) => (
              <div key={i} className="card-hover flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-brand-500/15 border border-brand-500/20 flex items-center justify-center text-xs font-bold text-brand-400 shrink-0">
                  {i + 1}
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{hack}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MONETIZATION */}
      {activeTab === 'monetize' && (
        <div className="space-y-4 animate-slide-up">
          <div>
            <h2 className="section-title">Monetization Roadmap</h2>
            <p className="section-sub mt-1">Step-by-step path from 0 to a sustainable coaching income.</p>
          </div>
          <div className="space-y-3">
            {strategy.monetizationPath?.map((step, i) => (
              <div key={i} className="card-hover flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {i + 1}
                  </div>
                  {i < (strategy.monetizationPath.length - 1) && (
                    <div className="w-0.5 h-full bg-brand-500/20 mt-1 grow" />
                  )}
                </div>
                <div className="flex-1 pb-2">
                  <p className="text-sm text-gray-300 leading-relaxed">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BIO */}
      {activeTab === 'bio' && (
        <div className="space-y-4 animate-slide-up">
          <div>
            <h2 className="section-title">Optimised Bios</h2>
            <p className="section-sub mt-1">Ready-to-use bios designed to drive DMs and profile clicks.</p>
          </div>
          {[
            { platform: 'Instagram', key: 'instagram', gradient: 'from-purple-500 to-pink-500' },
            { platform: 'TikTok',    key: 'tiktok',    gradient: 'from-gray-800 to-gray-600' },
          ].map(({ platform, key, gradient }) => (
            <div key={platform} className="card space-y-3">
              <div className="flex items-center gap-2">
                <div className={clsx('w-7 h-7 rounded-lg bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold', gradient)}>
                  {platform[0]}
                </div>
                <h3 className="font-semibold text-white">{platform}</h3>
                <button
                  onClick={() => copyBio(platform)}
                  className="ml-auto btn-ghost text-xs py-1.5"
                >
                  {copiedBio === platform
                    ? <><CheckCircle size={12} className="text-emerald-400" /> Copied!</>
                    : <><Share2 size={12} /> Copy bio</>
                  }
                </button>
              </div>
              <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed bg-dark-700 rounded-xl p-4 border border-white/5">
                {strategy.bioOptimization?.[key]}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
