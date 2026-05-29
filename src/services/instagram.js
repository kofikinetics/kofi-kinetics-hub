/**
 * Instagram Graph API service
 * Docs: https://developers.facebook.com/docs/instagram-api
 */
const BASE = 'https://graph.instagram.com'

export async function fetchIGProfile(userId, token) {
  const url = `${BASE}/${userId}?fields=username,followers_count,media_count,biography,website&access_token=${token}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Instagram API error: ${res.status}`)
  return res.json()
}

export async function fetchIGMedia(userId, token, limit = 25) {
  const fields = [
    'id', 'caption', 'media_type', 'media_url',
    'thumbnail_url', 'timestamp', 'like_count',
    'comments_count', 'permalink'
  ].join(',')
  const url = `${BASE}/${userId}/media?fields=${fields}&limit=${limit}&access_token=${token}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Instagram media error: ${res.status}`)
  return res.json()
}

export async function fetchIGInsights(mediaId, token) {
  const metrics = 'reach,impressions,saved,video_views'
  const url = `${BASE}/${mediaId}/insights?metric=${metrics}&access_token=${token}`
  const res = await fetch(url)
  if (!res.ok) return null // insights not always available
  return res.json()
}

// Derive an "engagement score" from available metrics
export function engagementScore(post) {
  const likes = post.like_count || 0
  const comments = post.comments_count || 0
  const views = post.video_views || 0
  return likes + (comments * 4) + (views * 0.1)
}

// Sort and tag posts by performance tier
export function rankPosts(posts) {
  const scored = posts.map(p => ({ ...p, score: engagementScore(p) }))
  scored.sort((a, b) => b.score - a.score)
  const max = scored[0]?.score || 1
  return scored.map((p, i) => ({
    ...p,
    tier: i < 3 ? 'top' : i < Math.ceil(scored.length * 0.3) ? 'strong' : 'average',
    percentile: Math.round((p.score / max) * 100),
  }))
}

// Extract patterns from top posts
export function extractPatterns(rankedPosts) {
  const top = rankedPosts.filter(p => p.tier === 'top' || p.tier === 'strong')

  const typeCount = {}
  top.forEach(p => {
    typeCount[p.media_type] = (typeCount[p.media_type] || 0) + 1
  })

  const hourCount = {}
  top.forEach(p => {
    const hour = new Date(p.timestamp).getHours()
    hourCount[hour] = (hourCount[hour] || 0) + 1
  })
  const bestHour = Object.entries(hourCount).sort((a, b) => b[1] - a[1])[0]?.[0]

  const dayCount = {}
  top.forEach(p => {
    const day = new Date(p.timestamp).toLocaleDateString('en-US', { weekday: 'long' })
    dayCount[day] = (dayCount[day] || 0) + 1
  })
  const bestDay = Object.entries(dayCount).sort((a, b) => b[1] - a[1])[0]?.[0]

  return {
    topFormat: Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'VIDEO',
    bestHour: bestHour ? `${bestHour}:00` : 'unknown',
    bestDay: bestDay || 'unknown',
    topCount: top.length,
  }
}
