import { useState, useCallback } from 'react'
import {
  RefreshCw, Instagram, TrendingUp, Eye, Heart,
  MessageCircle, Share2, Bookmark, Video, Image,
  AlertCircle, ExternalLink, BarChart3, ChevronDown
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import { useSettings } from '../hooks/useSettings'
import {
  fetchIGProfile, fetchIGMedia, rankPosts, extractPatterns
} from '../services/instagram'
import {
  fetchTikTokVideos, rankVideos, extractTikTokPatterns
} from '../services/tiktok'
import clsx from 'clsx'

const TIER_STYLES = {
  top:     'bg-brand-500/15 text-brand-400 border-brand-500/20',
  strong:  'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  average: 'bg-gray-500/15 text-gray-400 border-gray-500/20',
}

function StatPill({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-dark-700 rounded-xl border border-white/5">
      <Icon size={13} className="text-gray-500" />
      <span className="text-xs font-semibold text-white">{value ?? '–'}</span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  )
}

function PostCard({ post, platform }) {
  const isVideo = post.media_type === 'VIDEO' || post.view_count !== undefined
  const engagement = post.like_count ?? post.like_count ?? 0

  return (
    <div className="card-hover flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {isVideo ? <Video size={14} className="text-brand-400" /> : <Image size={14} className="text-blue-400" />}
          <span className="text-xs text-gray-500">{isVideo ? 'Reel/Video' : 'Image'}</span>
        </div>
        <span className={clsx('badge border text-xs', TIER_STYLES[post.tier])}>
          {post.tier === 'top' ? '🔥 Top' : post.tier === 'strong' ? '✅ Strong' : '📊 Average'}
        </span>
      </div>

      {post.caption && (
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{post.caption}</p>
      )}
      {post.title && (
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{post.title}</p>
      )}

      <div className="flex flex-wrap gap-2">
        {platform === 'instagram' ? (
          <>
            <StatPill icon={Heart}     value={post.like_count?.toLocaleString()}     label="likes" />
            <StatPill icon={MessageCircle} value={post.comments_count?.toLocaleString()} label="comments" />
          </>
        ) : (
          <>
            <StatPill icon={Eye}       value={post.view_count?.toLocaleString()}    label="views" />
            <StatPill icon={Heart}     value={post.like_count?.toLocaleString()}    label="likes" />
            <StatPill icon={Share2}    value={post.share_count?.toLocaleString()}   label="shares" />
          </>
        )}
      </div>

      {/* Performance bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-600">
          <span>Performance</span>
          <span className="text-gray-400">{post.percentile}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-dark-700 overflow-hidden">
          <div
            className={clsx(
              'h-full rounded-full transition-all',
              post.tier === 'top' ? 'bg-brand-500' : post.tier === 'strong' ? 'bg-emerald-500' : 'bg-gray-600'
            )}
            style={{ width: `${post.percentile}%` }}
          />
        </div>
      </div>

      {(post.permalink || post.embed_link) && (
        <a
          href={post.permalink || post.embed_link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 transition"
        >
          View post <ExternalLink size={11} />
        </a>
      )}
    </div>
  )
}

function EmptyState({ platform, navigate }) {
  return (
    <div className="card flex flex-col items-center gap-4 py-12 text-center">
      <div className="w-14 h-14 rounded-2xl bg-dark-700 flex items-center justify-center border border-white/5">
        <AlertCircle size={24} className="text-gray-600" />
      </div>
      <div>
        <p className="font-semibold text-white">No {platform} data yet</p>
        <p className="text-sm text-gray-500 mt-1 max-w-xs">
          Add your {platform === 'Instagram' ? 'Instagram' : 'TikTok'} API token in Settings to load your content automatically.
        </p>
      </div>
      <button
        onClick={() => navigate('/settings')}
        className="btn-secondary"
      >
        Go to Settings
      </button>
    </div>
  )
}

export default function MyAnalytics() {
  const { settings } = useSettings()
  const [tab, setTab] = useState('instagram')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [igData, setIgData] = useState(null)
  const [ttData, setTtData] = useState(null)
  const [filter, setFilter] = useState('all')

  const loadInstagram = useCallback(async () => {
    if (!settings.instagramToken || !settings.instagramUserId) return
    setLoading(true); setError(null)
    try {
      const [profile, media] = await Promise.all([
        fetchIGProfile(settings.instagramUserId, settings.instagramToken),
        fetchIGMedia(settings.instagramUserId, settings.instagramToken),
      ])
      const ranked = rankPosts(media.data || [])
      const patterns = extractPatterns(ranked)
      setIgData({ profile, posts: ranked, patterns })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [settings])

  const loadTikTok = useCallback(async () => {
    if (!settings.tiktokToken) return
    setLoading(true); setError(null)
    try {
      const data = await fetchTikTokVideos(settings.tiktokToken)
      const ranked = rankVideos(data?.data?.videos || [])
      const patterns = extractTikTokPatterns(ranked)
      setTtData({ videos: ranked, patterns })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [settings])

  const handleRefresh = () => {
    if (tab === 'instagram') loadInstagram()
    else loadTikTok()
  }

  const posts = tab === 'instagram'
    ? (igData?.posts || [])
    : (ttData?.videos || [])

  const filtered = filter === 'all' ? posts : posts.filter(p => p.tier === filter)

  // Chart data: top 10 posts by engagement score
  const chartData = posts.slice(0, 10).map((p, i) => ({
    name: `#${i + 1}`,
    score: Math.round(p.score),
    tier: p.tier,
  }))

  const hasIg = !!settings.instagramToken
  const hasTt = !!settings.tiktokToken

  return (
    <div className="space-y-6 max-w-5xl animate-slide-up">
      {/* Tabs */}
      <div className="flex items-center gap-3">
        {[
          { id: 'instagram', label: 'Instagram', available: hasIg },
          { id: 'tiktok',    label: 'TikTok',    available: hasTt },
        ].map(({ id, label, available }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={clsx(
              'px-4 py-2 rounded-xl text-sm font-semibold transition-all',
              tab === id
                ? 'bg-brand-500 text-white'
                : 'bg-dark-700 text-gray-400 hover:text-white border border-white/5'
            )}
          >
            {label}
            {!available && <span className="ml-1.5 text-[10px] text-gray-600">(not connected)</span>}
          </button>
        ))}
        <button
          onClick={handleRefresh}
          disabled={loading || (tab === 'instagram' ? !hasIg : !hasTt)}
          className="btn-secondary ml-auto disabled:opacity-40"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Loading…' : 'Load Data'}
        </button>
      </div>

      {error && (
        <div className="card border-red-500/20 bg-red-500/5 flex items-start gap-2">
          <AlertCircle size={15} className="text-red-400 shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Instagram */}
      {tab === 'instagram' && (
        !hasIg ? (
          <EmptyState platform="Instagram" navigate={(to) => window.location.hash = to} />
        ) : igData ? (
          <>
            {/* Profile strip */}
            <div className="card flex flex-wrap items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                KK
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white">{igData.profile.username}</p>
                <p className="text-xs text-gray-500 truncate">{igData.profile.biography}</p>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="font-bold text-white">{igData.profile.followers_count?.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Followers</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-white">{igData.profile.media_count}</p>
                  <p className="text-xs text-gray-500">Posts</p>
                </div>
              </div>
            </div>

            {/* Patterns */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Top Format',    value: igData.patterns.topFormat },
                { label: 'Best Hour',     value: igData.patterns.bestHour },
                { label: 'Best Day',      value: igData.patterns.bestDay },
              ].map(({ label, value }) => (
                <div key={label} className="card text-center">
                  <p className="text-xs text-gray-500 mb-1">{label}</p>
                  <p className="font-bold text-white">{value}</p>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="card">
              <p className="text-sm font-semibold text-white mb-4">Engagement Score — Top 10 Posts</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={chartData} barSize={24}>
                  <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
                  <Tooltip
                    contentStyle={{ background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10 }}
                    labelStyle={{ color: '#fff', fontSize: 12 }}
                    itemStyle={{ color: '#f97316', fontSize: 12 }}
                  />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.tier === 'top' ? '#f97316' : entry.tier === 'strong' ? '#10b981' : '#374151'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Posts grid */}
            <div className="flex items-center justify-between">
              <p className="section-title">Your Posts ({posts.length})</p>
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="input w-auto text-xs py-1.5"
              >
                <option value="all">All posts</option>
                <option value="top">Top only</option>
                <option value="strong">Strong</option>
                <option value="average">Average</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(post => (
                <PostCard key={post.id} post={post} platform="instagram" />
              ))}
            </div>
          </>
        ) : (
          <div className="card text-center py-12">
            <BarChart3 size={32} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">Click "Load Data" to fetch your Instagram posts</p>
          </div>
        )
      )}

      {/* TikTok */}
      {tab === 'tiktok' && (
        !hasTt ? (
          <EmptyState platform="TikTok" navigate={() => {}} />
        ) : ttData ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="card text-center">
                <p className="text-xs text-gray-500 mb-1">Best Video Duration</p>
                <p className="font-bold text-white">{ttData.patterns.bestDuration}</p>
              </div>
              <div className="card text-center">
                <p className="text-xs text-gray-500 mb-1">Top Performers</p>
                <p className="font-bold text-white">{ttData.patterns.topCount} videos</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(video => (
                <PostCard key={video.id} post={video} platform="tiktok" />
              ))}
            </div>
          </>
        ) : (
          <div className="card text-center py-12">
            <BarChart3 size={32} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">Click "Load Data" to fetch your TikTok videos</p>
          </div>
        )
      )}
    </div>
  )
}
