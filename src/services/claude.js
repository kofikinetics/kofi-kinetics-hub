/**
 * AI service — content generation via Groq API (free tier)
 * Uses llama-3.3-70b-versatile — fast, high-quality, and completely free.
 * Free tier: 14,400 requests/day, 500,000 tokens/minute
 *
 * Get your free API key at: https://console.groq.com
 * Groq uses an OpenAI-compatible format so swapping models is easy.
 *
 * NOTE: This calls the Groq API directly from the browser.
 * Fine for a personal tool — only you have the key.
 */

const GROQ_API = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'

async function callGroq(apiKey, systemPrompt, userPrompt) {
  const res = await fetch(GROQ_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2048,
      temperature: 0.7,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt   },
      ],
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Groq API error: ${res.status}`)
  }

  const data = await res.json()
  const text = data.choices?.[0]?.message?.content || ''

  // Strip any accidental markdown fences the model adds
  return text.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim()
}

export async function generateContentIdeas(apiKey, { handle, niche, audience, topPosts, platform, category }) {
  const system = `You are an expert social media strategist specializing in fitness coaching content for Instagram and TikTok.
You understand how to create content that converts followers into paying clients.
You always return structured JSON arrays. Never add markdown code fences or any text outside the JSON.`

  const topPostSummary = topPosts?.length
    ? `The creator's best performing content includes: ${topPosts.map(p => p.caption || p.title || '(no caption)').slice(0, 5).join(' | ')}`
    : ''

  const user = `Generate 8 content ideas for ${handle} (${niche}) targeting ${audience} on ${platform}.
${topPostSummary}
Category filter: ${category || 'all'}.

Return a JSON array of exactly 8 objects. Each object must have:
- "title": short punchy title (max 8 words)
- "hook": opening line to grab attention (max 15 words)
- "format": one of "Reel/TikTok", "Carousel", "Story", "Tutorial", "Talking Head", "Transformation"
- "script": 3-4 sentence outline of what to say/show
- "fullScript": a complete, ready-to-film word-for-word script. Structure it as an object with:
    - "opening": the exact first 5-10 words to say on camera (the hook spoken out loud)
    - "body": array of 3-5 strings, each being a spoken section or scene direction (e.g. "Cut to: show your form from the side" or "Say: 'Most guys make this mistake...'")
    - "closing": the exact closing line with the CTA spoken out loud
    - "onScreenText": array of 2-4 short text overlays to flash on screen during the video
    - "visualDirections": 2-3 strings describing camera angles, transitions or b-roll shots
    - "estimatedDuration": estimated video length e.g. "30-45 seconds"
- "caption": ready-to-post caption with emojis and CTA (max 80 words)
- "hashtags": array of 8 relevant hashtags (strings starting with #)
- "cta": specific call-to-action that drives DMs or link clicks
- "whyItConverts": 1 sentence explaining why this will turn followers into clients
- "category": one of "workout", "transformation", "nutrition", "motivation", "behind-scenes", "client-results"

Return only raw JSON, nothing else.`

  const raw = await callGroq(apiKey, system, user)
  return JSON.parse(raw)
}

export async function analyzeCompetitor(apiKey, { handle, niche, audience }) {
  const system = `You are a social media intelligence analyst. You analyze fitness creators' public strategies and provide actionable cloning frameworks.
Return structured JSON only. Never add markdown code fences or text outside the JSON.`

  const user = `Analyze the public content strategy of ${handle}, a fitness content creator on Instagram/TikTok.
Based on what is publicly known about successful fitness creators in this niche, produce a detailed strategic breakdown.

Return a JSON object with these exact keys:
- "profileSummary": string (2 sentences about their likely strategy)
- "topContentTypes": array of 4 objects: { "type": string, "description": string, "engagementLevel": "High" | "Medium" | "Low" }
- "contentPatterns": array of 4 strings (key patterns in their best content)
- "postingCadence": string (their likely posting frequency)
- "audienceHook": string (what specifically appeals to their audience)
- "monetizationSignals": string (how they likely convert followers to clients)
- "cloneStrategy": array of 5 objects: { "title": string, "twist": string, "format": string, "hook": string }
- "keyDifference": string (what @kofi.kinetics should do differently to stand out)

Return only raw JSON.`

  const raw = await callGroq(apiKey, system, user)
  return JSON.parse(raw)
}

export async function generateStrategy(apiKey, { handle, niche, audience, platforms }) {
  const system = `You are a world-class fitness coaching business strategist who specializes in social media content that converts followers into high-ticket coaching clients.
Return structured JSON only. Never add markdown code fences or text outside the JSON.`

  const user = `Create a comprehensive 30-day content strategy for ${handle}, an online fitness coach targeting ${audience} on ${platforms.join(' and ')}.

Return a JSON object with these exact keys:
- "strategyOverview": string (3 sentences)
- "contentMix": { "educational": number, "motivational": number, "transformation": number, "personal": number, "promotional": number } (percentages summing to 100)
- "conversionFunnel": array of 4 objects: { "stage": string, "goal": string, "contentType": string, "example": string }
- "weeklySchedule": object with keys Monday through Sunday, each: { "platform": string, "format": string, "topic": string, "time": string }
- "growthHacks": array of 6 strings (specific tactics for the male 22-30 audience)
- "monetizationPath": array of 4 strings (steps to convert followers to coaching clients)
- "bioOptimization": { "instagram": string, "tiktok": string }
- "monthlyGoals": { "followers": string, "dmConversions": string, "contentPieces": number }

Return only raw JSON.`

  const raw = await callGroq(apiKey, system, user)
  return JSON.parse(raw)
}
