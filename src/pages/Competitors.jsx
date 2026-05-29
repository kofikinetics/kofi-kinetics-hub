import { useState } from 'react'
import {
  Users, Plus, Trash2, Sparkles, ExternalLink,
  TrendingUp, Copy, AlertCircle, RefreshCw, Info,
  ChevronDown, ChevronUp, Eye
} from 'lucide-react'
import { useSettings } from '../hooks/useSettings'
import { analyzeCompetitor } from '../services/claude'
import clsx from 'clsx'

const SUGGESTED_COMPETITORS = [
  { handle: '@athleanx',          niche: 'Workout science & form',   platform: 'YouTube/IG' },
  { handle: '@cbum',              niche: 'Bodybuilding lifestyle',    platform: 'IG/TT' },
  { handle: '@jeffnippard',       niche: 'Science-based training',   platform: 'IG/YT' },
  { handle: '@mikethurston',      niche: 'Physique & motivation',     platform: 'IG/YT' },
  { handle: '@davidlevy',         niche: 'Online coaching results',  platform: 'IG/TT' },
  { handle: '@simeonpanda',       niche: 'Aesthetic fitness',        platform: 'IG' },
  { handle: '@tristanleecfit',    niche: 'Online PT transformation', platform: 'IG/TT' },
  { handle: '@garagegym_homie',   niche: 'Home fitness & budget',    platform: 'TT' },
]

function CompetitorCard({ competitor, onAnalyze, onRemove, analyzing }) {
  const [open, setOpen] = useState(false)
  const hasAnalysis = !!competitor.analysis

  return (
    <div className="card space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-500/20 flex items-center justify-center text-sm font-bold text-white shrink-0">
          {competitor.handle[1]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <p className="font-semibold text-white">{competitor.handle}</p>
              <p className="text-xs text-gray-500">{competitor.niche}</p>
              {competitor.platform && (
                <span className="tag text-xs mt-1 inline-block">{competitor.platform}</span>
              )}
            </div>
            <button
              onClick={() => onRemove(competitor.handle)}
              className="text-gray-600 hover:text-red-400 transition p-1 rounded-lg"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>

      {hasAnalysis ? (
        <>
          <div className="p-3 bg-dark-700 rounded-xl border border-white/5">
            <p className="text-xs text-gray-300 leading-relaxed">{competitor.analysis.profileSummary}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Top Content Types</p>
            <div className="space-y-1.5">
              {competitor.analysis.topContentTypes?.slice(0, 3).map((ct, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <span className={clsx(
                    'mt-0.5 w-2 h-2 rounded-full shrink-0',
                    ct.engagementLevel === 'High' ? 'bg-brand-500' : ct.engagementLevel === 'Medium' ? 'bg-yellow-500' : 'bg-gray-500'
                  )} />
                  <span className="text-gray-300"><span className="text-white font-medium">{ct.type}</span> — {ct.description}</span>
                </div>
              ))}
            </div>
          </div>

          {open && competitor.analysis.cloneStrategy && (
            <div className="space-y-3 animate-slide-up">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Clone Strategy for @kofi.kinetics
                </p>
                <div className="space-y-2">
                  {competitor.analysis.cloneStrategy.map((idea, i) => (
                    <div key={i} className="p-3 bg-brand-500/5 border border-brand-500/15 rounded-xl space-y-1">
                      <p className="text-sm font-semibold text-white">{idea.title}</p>
                      <p className="text-xs text-gray-400"><span className="text-brand-400 font-medium">Your twist:</span> {idea.twist}</p>
                      <p className="text-xs text-gray-500">Format: {idea.format} · Hook: "{idea.hook}"</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                <p className="text-xs font-semibold text-emerald-400 mb-1">How to stand out from them</p>
                <p className="text-xs text-gray-300">{competitor.analysis.keyDifference}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Audience Hook</p>
                <p className="text-xs text-gray-400">{competitor.analysis.audienceHook}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">How they monetize</p>
                <p className="text-xs text-gray-400">{competitor.analysis.monetizationSignals}</p>
              </div>
            </div>
          )}

          <button
            onClick={() => setOpen(v => !v)}
            className="btn-ghost w-full justify-center text-xs"
          >
            {open ? <><ChevronUp size={13} /> Less detail</> : <><ChevronDown size={13} /> Clone strategy & full analysis</>}
          </button>
        </>
      ) : (
        <button
          onClick={() => onAnalyze(competitor.handle)}
          disabled={analyzing === competitor.handle}
          className="btn-primary w-full justify-center text-xs disabled:opacity-50"
        >
          {analyzing === competitor.handle ? (
            <><RefreshCw size={12} className="animate-spin" /> Analyzing…</>
          ) : (
            <><Sparkles size={12} /> AI Analyze & Clone Strategy</>
          )}
        </button>
      )}
    </div>
  )
}

export default function Competitors() {
  const { settings } = useSettings()
  const [competitors, setCompetitors] = useState(
    SUGGESTED_COMPETITORS.slice(0, 3).map(c => ({ ...c, analysis: null }))
  )
  const [newHandle, setNewHandle] = useState('')
  const [newNiche, setNewNiche] = useState('')
  const [analyzing, setAnalyzing] = useState(null)
  const [error, setError] = useState(null)

  const addCompetitor = (h, n) => {
    const handle = (h || newHandle).trim()
    if (!handle) return
    const niche = n || newNiche || 'fitness content creator'
    if (competitors.find(c => c.handle === handle)) return
    setCompetitors(prev => [...prev, { handle, niche, platform: '', analysis: null }])
    setNewHandle('')
    setNewNiche('')
  }

  const removeCompetitor = (handle) => {
    setCompetitors(prev => prev.filter(c => c.handle !== handle))
  }

  const analyzeAccount = async (handle) => {
    if (!settings.groqApiKey) {
      setError('Add your free Groq API key in Settings to use AI analysis.')
      return
    }
    setAnalyzing(handle); setError(null)
    try {
      const analysis = await analyzeCompetitor(settings.groqApiKey, {
        handle,
        niche: settings.niche,
        audience: settings.audience,
      })
      setCompetitors(prev =>
        prev.map(c => c.handle === handle ? { ...c, analysis } : c)
      )
    } catch (e) {
      setError(e.message)
    } finally {
      setAnalyzing(null)
    }
  }

  const remaining = SUGGESTED_COMPETITORS.filter(
    s => !competitors.find(c => c.handle === s.handle)
  )

  return (
    <div className="space-y-6 max-w-5xl animate-slide-up">
      {/* Info banner */}
      <div className="card border-blue-500/20 bg-blue-500/5 flex items-start gap-3">
        <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-300">How competitor analysis works</p>
          <p className="text-xs text-blue-400/70 mt-0.5">
            Official APIs don't expose competitor post metrics. Instead, our AI analyzes each creator's public strategy based on known patterns in the fitness coaching space, then generates a custom "clone plan" adapted for <span className="text-blue-300">@kofi.kinetics</span> and your {settings.audience} audience.
          </p>
        </div>
      </div>

      {error && (
        <div className="card border-red-500/20 bg-red-500/5 flex items-start gap-2">
          <AlertCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      {/* Add competitor */}
      <div className="card space-y-3">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Plus size={16} className="text-brand-400" /> Add a Competitor
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="@handle (e.g. @athleanx)"
            value={newHandle}
            onChange={e => setNewHandle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCompetitor()}
            className="input flex-1"
          />
          <input
            type="text"
            placeholder="Their niche (optional)"
            value={newNiche}
            onChange={e => setNewNiche(e.target.value)}
            className="input flex-1"
          />
          <button onClick={() => addCompetitor()} className="btn-primary shrink-0">
            <Plus size={15} /> Add
          </button>
        </div>
      </div>

      {/* Suggested accounts */}
      {remaining.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Suggested Fitness Accounts to Track
          </p>
          <div className="flex flex-wrap gap-2">
            {remaining.map(s => (
              <button
                key={s.handle}
                onClick={() => addCompetitor(s.handle, s.niche)}
                className="flex items-center gap-2 px-3 py-1.5 bg-dark-700 border border-white/10 rounded-xl text-xs text-gray-300 hover:text-white hover:border-brand-500/30 transition"
              >
                <Plus size={11} className="text-brand-400" />
                {s.handle}
                <span className="text-gray-600">· {s.niche}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Competitor cards */}
      <div>
        <h2 className="section-title mb-4">Tracked Accounts ({competitors.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {competitors.map(comp => (
            <CompetitorCard
              key={comp.handle}
              competitor={comp}
              onAnalyze={analyzeAccount}
              onRemove={removeCompetitor}
              analyzing={analyzing}
            />
          ))}
        </div>
        {competitors.length === 0 && (
          <div className="card text-center py-10">
            <Users size={28} className="text-gray-600 mx-auto mb-2" />
            <p className="text-gray-400">Add competitors above to track and clone their strategies.</p>
          </div>
        )}
      </div>
    </div>
  )
}
