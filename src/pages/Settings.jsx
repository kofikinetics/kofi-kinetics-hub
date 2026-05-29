import { useState } from 'react'
import { Save, Eye, EyeOff, ExternalLink, CheckCircle, Info } from 'lucide-react'
import { useSettings } from '../hooks/useSettings'

function Field({ label, hint, value, onChange, placeholder, type = 'text', secret }) {
  const [show, setShow] = useState(false)
  const inputType = secret ? (show ? 'text' : 'password') : type

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="input pr-10"
        />
        {secret && (
          <button
            type="button"
            onClick={() => setShow(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
          >
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {hint && <p className="text-xs text-gray-600">{hint}</p>}
    </div>
  )
}

function Section({ title, children, guide, guideUrl }) {
  return (
    <div className="card space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white">{title}</h3>
        {guide && (
          <a
            href={guideUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 transition font-medium"
          >
            Setup guide <ExternalLink size={11} />
          </a>
        )}
      </div>
      {children}
    </div>
  )
}

export default function Settings() {
  const { settings, saveSettings } = useSettings()
  const [form, setForm] = useState({ ...settings })
  const [saved, setSaved] = useState(false)

  const set = (key) => (val) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSave = () => {
    saveSettings(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6 max-w-2xl animate-slide-up">
      <div>
        <p className="section-title">Settings</p>
        <p className="section-sub mt-1">
          Connect your platforms and configure the AI engine. All keys are stored locally in your browser — never sent to any server.
        </p>
      </div>

      {/* Profile */}
      <Section title="Your Profile">
        <Field
          label="Instagram / TikTok Handle"
          value={form.handle}
          onChange={set('handle')}
          placeholder="@kofi.kinetics"
        />
        <Field
          label="Your Niche"
          value={form.niche}
          onChange={set('niche')}
          placeholder="e.g. online fitness coaching, calisthenics"
        />
        <Field
          label="Primary Audience"
          value={form.audience}
          onChange={set('audience')}
          placeholder="e.g. males aged 22–30 interested in fitness"
        />
      </Section>

      {/* Instagram */}
      <Section
        title="Instagram Graph API"
        guide="How to get token"
        guideUrl="https://developers.facebook.com/docs/instagram-api/getting-started"
      >
        <div className="flex items-start gap-2 p-3 bg-dark-700 rounded-xl border border-white/5">
          <Info size={14} className="text-blue-400 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-400">
            You need a <strong className="text-gray-200">Meta Business App</strong> with your Instagram Business Account linked. Go to{' '}
            <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline">
              developers.facebook.com
            </a>{' '}
            → create an app → add Instagram Graph API → generate a long-lived access token. Paste it below.
          </p>
        </div>
        <Field
          label="Instagram User ID"
          value={form.instagramUserId}
          onChange={set('instagramUserId')}
          placeholder="e.g. 17841400000000000"
          hint="Found in the Graph API Explorer after authenticating"
        />
        <Field
          label="Instagram Long-lived Access Token"
          value={form.instagramToken}
          onChange={set('instagramToken')}
          placeholder="EAAxxxxxxx..."
          secret
          hint="Expires every 60 days — click 'Refresh Token' to renew"
        />
      </Section>

      {/* TikTok */}
      <Section
        title="TikTok API"
        guide="How to get token"
        guideUrl="https://developers.tiktok.com/doc/overview"
      >
        <div className="flex items-start gap-2 p-3 bg-dark-700 rounded-xl border border-white/5">
          <Info size={14} className="text-blue-400 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-400">
            Apply for the <strong className="text-gray-200">TikTok for Developers</strong> Display API at{' '}
            <a href="https://developers.tiktok.com" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline">
              developers.tiktok.com
            </a>
            . Once approved, generate an access token via OAuth. For competitor research, apply for the Research API (takes a few days to get approved).
          </p>
        </div>
        <Field
          label="TikTok Access Token"
          value={form.tiktokToken}
          onChange={set('tiktokToken')}
          placeholder="act.xxxxxxx..."
          secret
          hint="Get this from your TikTok Developer App after OAuth authentication"
        />
      </Section>

      {/* Groq AI */}
      <Section
        title="Groq AI — Free Content Generation"
        guide="Get free API key"
        guideUrl="https://console.groq.com"
      >
        <div className="flex items-start gap-2 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
          <Info size={14} className="text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-400">
            <strong className="text-emerald-300">100% free.</strong> Groq runs Llama 3.3 70B — a top-tier open-source model — at no cost.
            Sign up at{' '}
            <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline">
              console.groq.com
            </a>
            {' '}→ API Keys → Create API Key. Takes 2 minutes. No credit card required.
            Free tier gives you 14,400 requests/day — more than enough.
          </p>
        </div>
        <Field
          label="Groq API Key"
          value={form.groqApiKey}
          onChange={set('groqApiKey')}
          placeholder="gsk_xxxxxxxxxxxxxxxxxxxxxxxx..."
          secret
          hint="Stored locally in your browser only. Never sent to any external server."
        />
      </Section>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button onClick={handleSave} className="btn-primary">
          {saved ? <CheckCircle size={15} /> : <Save size={15} />}
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
        {saved && <p className="text-xs text-emerald-400">Changes saved to browser storage.</p>}
      </div>
    </div>
  )
}
