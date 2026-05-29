import { useState } from 'react'
import {
  Lightbulb, Sparkles, Copy, Bookmark,
  ChevronRight, Video, Image, Layout, Mic, Repeat2,
  AlertCircle, CheckCircle, RefreshCw, Film, Monitor,
  Play, MessageSquare, Clock
} from 'lucide-react'
import { useSettings } from '../hooks/useSettings'
import { generateContentIdeas } from '../services/claude'
import clsx from 'clsx'

const CATEGORIES = [
  { id: 'all',            label: 'All Ideas'       },
  { id: 'workout',        label: 'Workout Tips'    },
  { id: 'transformation', label: 'Transformation'  },
  { id: 'nutrition',      label: 'Nutrition'       },
  { id: 'motivation',     label: 'Motivation'      },
  { id: 'behind-scenes',  label: 'Behind the Scenes'},
  { id: 'client-results', label: 'Client Results'  },
]

const PLATFORMS = ['Instagram', 'TikTok', 'Both']

const FORMAT_ICONS = {
  'Reel/TikTok':    Video,
  'Carousel':       Layout,
  'Story':          Image,
  'Tutorial':       Video,
  'Talking Head':   Mic,
  'Transformation': Repeat2,
}

// Seed ideas shown before AI generation
const SEED_IDEAS = [
  {
    title: '"The 3-Move Morning Routine"',
    hook: 'Do these 3 moves BEFORE breakfast — your body will thank you.',
    format: 'Reel/TikTok',
    script: 'Open on you already mid-workout at 6AM. Show 3 quick compound movements (squat, push-up, row). End with your energy level and body transformation progress shot.',
    caption: '🌅 No gym? No excuse. These 3 moves take 8 minutes and hit your full body. Swipe for form tips or DM me "MORNING" and I\'ll send you the full routine 💪 #fitness #morningroutine #onlinecoach',
    hashtags: ['#fitness', '#morningroutine', '#bodyweight', '#onlinecoach', '#workout', '#healthylifestyle', '#fitnessmotivation', '#gains'],
    cta: 'DM "MORNING" for the full routine',
    whyItConverts: 'Gives immediate value while positioning you as the coach who makes fitness simple and accessible.',
    category: 'workout',
  },
  {
    title: '"What I Eat in a Day (Cutting Phase)"',
    hook: 'Eating this much and STILL losing fat — here\'s exactly how.',
    format: 'Reel/TikTok',
    script: 'Day-in-the-life format. Show breakfast, lunch, dinner and 1 snack with macros. End with "DM me DIET for a custom plan".',
    caption: '🍳 Full day of eating while cutting 5kg. No starvation, no crazy restrictions. Drop a ❤️ if you want a full meal plan breakdown! #mealplan #cutting #fitness #onlinecoach',
    hashtags: ['#mealplan', '#cutting', '#fitnessdiet', '#onlinecoach', '#nutrition', '#macros', '#weightloss', '#leanmuscle'],
    cta: 'DM "DIET" for a custom meal plan',
    whyItConverts: 'Nutrition is the #1 question from beginners — answering it builds trust and drives DMs.',
    category: 'nutrition',
  },
  {
    title: '"30-Day Transformation (Client Story)"',
    hook: 'He lost 7kg in 30 days without stepping in a gym once.',
    format: 'Transformation',
    script: 'Before/after of a client. Show their starting point, the 3 key changes you made together, and their result. Keep it raw and authentic.',
    caption: '🔥 30 days. Zero gym. REAL results. @client dropped 7kg working with me online. If you\'re ready to start YOUR transformation, link in bio or DM me "READY" ⬇️ #transformation #clientresults #onlinecoaching',
    hashtags: ['#transformation', '#clientresults', '#onlinecoaching', '#weightlosstransformation', '#fitness', '#before&after', '#onlinecoach', '#fitnessjourney'],
    cta: 'DM "READY" to start your transformation',
    whyItConverts: 'Social proof is the most powerful conversion tool — real client results turn skeptics into buyers.',
    category: 'client-results',
  },
]

function FullScript({ script }) {
  if (!script) return null
  const [copied, setCopied] = useState(false)

  const fullText = [
    `🎬 OPENING:\n"${script.opening}"`,
    `\n📹 BODY:\n${script.body?.map((s, i) => `${i + 1}. ${s}`).join('\n')}`,
    `\n🎯 CLOSING:\n"${script.closing}"`,
    script.onScreenText?.length ? `\n📝 ON-SCREEN TEXT:\n${script.onScreenText.map(t => `• ${t}`).join('\n')}` : '',
    script.visualDirections?.length ? `\n🎥 VISUALS:\n${script.visualDirections.map(v => `• ${v}`).join('\n')}` : '',
  ].filter(Boolean).join('')

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-3 border-t border-white/5 pt-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Film size={13} className="text-brand-400" />
          <p className="text-xs font-bold text-white uppercase tracking-wider">Full Script</p>
          {script.estimatedDuration && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Clock size={11} /> {script.estimatedDuration}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 transition font-medium"
        >
          {copied ? <><CheckCircle size={11} /> Copied!</> : <><Copy size={11} /> Copy script</>}
        </button>
      </div>

      {/* Opening */}
      <div className="rounded-xl overflow-hidden border border-white/5">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-500/20 border-b border-brand-500/20">
          <Play size={11} className="text-brand-400" />
          <span className="text-xs font-semibold text-brand-300 uppercase tracking-wider">Opening Hook</span>
        </div>
        <div className="p-3 bg-dark-700">
          <p className="text-sm text-white font-medium leading-relaxed">"{script.opening}"</p>
        </div>
      </div>

      {/* Body */}
      {script.body?.length > 0 && (
        <div className="rounded-xl overflow-hidden border border-white/5">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/15 border-b border-blue-500/20">
            <MessageSquare size={11} className="text-blue-400" />
            <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">Main Content</span>
          </div>
          <div className="divide-y divide-white/5">
            {script.body.map((line, i) => (
              <div key={i} className="flex gap-3 p-3 bg-dark-700">
                <span className="w-5 h-5 rounded-full bg-dark-600 border border-white/10 flex items-center justify-center text-xs font-bold text-gray-400 shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-200 leading-relaxed">{line}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Closing */}
      {script.closing && (
        <div className="rounded-xl overflow-hidden border border-white/5">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/15 border-b border-emerald-500/20">
            <Play size={11} className="text-emerald-400 rotate-180" />
            <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Closing CTA</span>
          </div>
          <div className="p-3 bg-dark-700">
            <p className="text-sm text-white font-medium leading-relaxed">"{script.closing}"</p>
          </div>
        </div>
      )}

      {/* On-screen text + visuals in a 2-col grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {script.onScreenText?.length > 0 && (
          <div className="rounded-xl overflow-hidden border border-white/5">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/15 border-b border-purple-500/20">
              <Monitor size={11} className="text-purple-400" />
              <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">On-Screen Text</span>
            </div>
            <div className="p-3 bg-dark-700 space-y-1.5">
              {script.onScreenText.map((t, i) => (
                <p key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                  <span className="text-purple-400 shrink-0">▶</span> {t}
                </p>
              ))}
            </div>
          </div>
        )}

        {script.visualDirections?.length > 0 && (
          <div className="rounded-xl overflow-hidden border border-white/5">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/15 border-b border-amber-500/20">
              <Film size={11} className="text-amber-400" />
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Camera / Visuals</span>
            </div>
            <div className="p-3 bg-dark-700 space-y-1.5">
              {script.visualDirections.map((v, i) => (
                <p key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                  <span className="text-amber-400 shrink-0">🎥</span> {v}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function IdeaCard({ idea, onCopy, onSave, saved }) {
  const [open, setOpen] = useState(false)
  const Icon = FORMAT_ICONS[idea.format] || Video

  return (
    <div className="card-hover space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center shrink-0">
          <Icon size={16} className="text-brand-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold text-white text-sm leading-snug">{idea.title}</p>
            <span className="tag shrink-0">{idea.format}</span>
          </div>
          <p className="text-xs text-brand-400 mt-1 italic">"{idea.hook}"</p>
        </div>
      </div>

      <p className="text-xs text-gray-400 leading-relaxed">{idea.script}</p>

      <div className="p-3 bg-dark-700 rounded-xl border border-white/5">
        <p className="text-xs text-gray-300 leading-relaxed">{idea.caption}</p>
      </div>

      {open && (
        <div className="space-y-3 animate-slide-up">
          {/* Full Script — shown first and prominently */}
          {idea.fullScript && <FullScript script={idea.fullScript} />}

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">CTA</p>
            <p className="text-sm text-brand-400 font-medium">{idea.cta}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Hashtags</p>
            <div className="flex flex-wrap gap-1.5">
              {idea.hashtags?.map(tag => (
                <span key={tag} className="tag text-xs">{tag}</span>
              ))}
            </div>
          </div>
          <div className="p-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl">
            <p className="text-xs text-emerald-400">
              <span className="font-semibold">Why it converts: </span>{idea.whyItConverts}
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => setOpen(v => !v)}
          className="btn-ghost text-xs flex-1 justify-center"
        >
          {open ? 'Show less' : 'Full details'} <ChevronRight size={13} className={clsx('transition-transform', open && 'rotate-90')} />
        </button>
        <button
          onClick={() => onCopy(idea)}
          className="btn-ghost text-xs p-2"
          title="Copy caption"
        >
          <Copy size={14} />
        </button>
        <button
          onClick={() => onSave(idea)}
          className={clsx('p-2 rounded-xl transition', saved ? 'text-brand-400' : 'text-gray-500 hover:text-white hover:bg-white/5')}
          title="Save idea"
        >
          <Bookmark size={14} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  )
}

export default function ContentIdeas() {
  const { settings } = useSettings()
  const [ideas, setIdeas] = useState(SEED_IDEAS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [category, setCategory] = useState('all')
  const [platform, setPlatform] = useState('Both')
  const [saved, setSaved] = useState(new Set())
  const [copied, setCopied] = useState(null)
  const [generated, setGenerated] = useState(false)

  const handleGenerate = async () => {
    if (!settings.groqApiKey) {
      setError('Add your free Groq API key in Settings to generate AI-powered ideas.')
      return
    }
    setLoading(true); setError(null)
    try {
      const results = await generateContentIdeas(settings.groqApiKey, {
        handle: settings.handle,
        niche: settings.niche,
        audience: settings.audience,
        platform,
        category: category === 'all' ? null : category,
        topPosts: [],
      })
      setIdeas(results)
      setGenerated(true)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (idea) => {
    const text = `${idea.caption}\n\n${idea.hashtags?.join(' ')}\n\nHook: "${idea.hook}"\nCTA: ${idea.cta}`
    navigator.clipboard.writeText(text)
    setCopied(idea.title)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleSave = (idea) => {
    setSaved(prev => {
      const next = new Set(prev)
      next.has(idea.title) ? next.delete(idea.title) : next.add(idea.title)
      return next
    })
  }

  const filtered = category === 'all' ? ideas : ideas.filter(i => i.category === category)

  return (
    <div className="space-y-6 max-w-5xl animate-slide-up">
      {/* Controls */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={16} className="text-brand-400" />
          <h2 className="font-semibold text-white">Generate AI Content Ideas</h2>
          {generated && (
            <span className="ml-auto badge bg-brand-500/15 text-brand-400 border border-brand-500/20">
              AI-generated ✓
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500">
          Ideas are tailored for <span className="text-white">@kofi.kinetics</span> targeting <span className="text-white">{settings.audience}</span>.
          {!settings.groqApiKey && (
            <span className="text-amber-400"> Add your free Groq API key in Settings for personalized ideas.</span>
          )}
        </p>

        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[180px]">
            <label className="text-xs text-gray-500 mb-1 block">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="input text-xs py-2"
            >
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="text-xs text-gray-500 mb-1 block">Platform</label>
            <select
              value={platform}
              onChange={e => setPlatform(e.target.value)}
              className="input text-xs py-2"
            >
              {PLATFORMS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
            <AlertCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="btn-primary w-full justify-center"
        >
          {loading ? (
            <><RefreshCw size={14} className="animate-spin" /> Generating ideas…</>
          ) : (
            <><Sparkles size={14} /> Generate {category === 'all' ? '' : category + ' '}Ideas with AI</>
          )}
        </button>
      </div>

      {copied && (
        <div className="flex items-center gap-2 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl animate-slide-up">
          <CheckCircle size={14} className="text-emerald-400" />
          <p className="text-xs text-emerald-400 font-medium">Caption copied to clipboard!</p>
        </div>
      )}

      {/* Ideas grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">
            {generated ? 'AI-Generated Ideas' : 'Starter Ideas'} ({filtered.length})
          </h2>
          {saved.size > 0 && (
            <span className="text-xs text-brand-400 font-medium">{saved.size} saved</span>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((idea, i) => (
            <IdeaCard
              key={idea.title + i}
              idea={idea}
              onCopy={handleCopy}
              onSave={handleSave}
              saved={saved.has(idea.title)}
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="card text-center py-10">
            <Lightbulb size={28} className="text-gray-600 mx-auto mb-2" />
            <p className="text-gray-400">No ideas in this category yet. Generate some above!</p>
          </div>
        )}
      </div>
    </div>
  )
}
