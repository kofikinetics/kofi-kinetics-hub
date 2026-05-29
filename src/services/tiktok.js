/**
 * TikTok Display API service
 * Docs: https://developers.tiktok.com/doc/tiktok-api-v2-video-list
 */
const BASE = 'https://open.tiktokapis.com/v2'

export async function fetchTikTokVideos(token, cursor = 0, maxCount = 20) {
  const fields = [
    'id', 'title', 'video_description', 'duration',
    'cover_image_url', 'embed_link', 'like_count',
    'comment_count', 'share_count', 'view_count',
    'create_time'
  ].join(',')

  const res = await fetch(`${BASE}/video/list/?fields=${fields}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ max_count: maxCount, cursor }),
  })
  if (!res.ok) throw new Error(`TikTok API error: ${res.status}`)
  return res.json()
}

export function engagementScore(video) {
  const likes    = video.like_count    || 0
  const comments = video.comment_count || 0
  const shares   = video.share_count   || 0
  const views    = video.view_count    || 0
  // Weighted: shares > comments > likes; views as baseline
  return (shares * 10) + (comments * 5) + (likes * 2) + (views * 0.05)
}

export function rankVideos(videos) {
  const scored = videos.map(v => ({ ...v, score: engagementScore(v) }))
  scored.sort((a, b) => b.score - a.score)
  const max = scored[0]?.score || 1
  return scored.map((v, i) => ({
    ...v,
    tier: i < 3 ? 'top' : i < Math.ceil(scored.length * 0.3) ? 'strong' : 'average',
    percentile: Math.round((v.score / max) * 100),
    engagementRate: v.view_count > 0
      ? (((v.like_count + v.comment_count + v.share_count) / v.view_count) * 100).toFixed(2)
      : '0.00',
  }))
}

export function extractTikTokPatterns(rankedVideos) {
  const top = rankedVideos.filter(v => v.tier === 'top' || v.tier === 'strong')

  // Duration buckets
  const buckets = { 'Under 15s': 0, '15–30s': 0, '30–60s': 0, '60–90s': 0, '90s+': 0 }
  top.forEach(v => {
    const d = v.duration || 0
    if (d < 15) buckets['Under 15s']++
    else if (d < 30) buckets['15–30s']++
    else if (d < 60) buckets['30–60s']++
    else if (d < 90) buckets['60–90s']++
    else buckets['90s+']++
  })
  const bestDuration = Object.entries(buckets).sort((a, b) => b[1] - a[1])[0]?.[0]

  return { bestDuration, topCount: top.length }
}
