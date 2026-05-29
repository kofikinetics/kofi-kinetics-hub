# Kofi Kinetics — Content Hub

An AI-powered content strategy webapp for @kofi.kinetics, built for Instagram & TikTok fitness coaching growth.

## Features

- **My Analytics** — Connect Instagram & TikTok APIs to see your top-performing content ranked by engagement
- **Content Ideas** — AI-generated ideas (hooks, scripts, captions, hashtags) personalised to your niche and audience
- **Competitor Intelligence** — Track and clone content strategies from top fitness accounts
- **Strategy Hub** — Full 30-day content calendar, conversion funnel, growth hacks, and optimised bios

---

## Quick Start (Local Development)

### 1. Install dependencies
```bash
cd content-hub
npm install
```

### 2. Run locally
```bash
npm run dev
```
Open http://localhost:5173/kofi-kinetics-hub/

### 3. Add your API keys
Open the app → Settings → paste your API keys. They're stored in your browser only.

---

## Deploy to GitHub Pages

### Step 1: Create a GitHub repo
Go to github.com → New repository → name it `kofi-kinetics-hub`

### Step 2: Update the base URL
In `vite.config.js` and `src/main.jsx`, change `/kofi-kinetics-hub/` to match your repo name if different.

### Step 3: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/kofi-kinetics-hub.git
git push -u origin main
```

### Step 4: Deploy
```bash
npm run deploy
```
This builds the app and pushes it to the `gh-pages` branch.

### Step 5: Enable GitHub Pages
GitHub repo → Settings → Pages → Source: `gh-pages` branch → Save

Your app will be live at: `https://YOUR_USERNAME.github.io/kofi-kinetics-hub/`

---

## API Setup Guides

### Instagram Graph API
1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Create a new app → Business type
3. Add product: Instagram Graph API
4. Connect your Instagram Business Account
5. Generate a long-lived access token (valid 60 days, renewable)
6. Find your User ID in the Graph API Explorer
7. Paste both into Settings inside the app

### TikTok API
1. Go to [developers.tiktok.com](https://developers.tiktok.com)
2. Create an app → apply for Display API access
3. Once approved, authenticate with OAuth to get an access token
4. Paste into Settings inside the app

### Groq AI — FREE Content Generation (Start Here)
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up — no credit card required
3. Go to **API Keys** → **Create API Key**
4. Copy the key (starts with `gsk_...`)
5. Paste it into **Settings** inside the app

Free tier gives you **14,400 requests/day** running **Llama 3.3 70B** — a top-tier open-source model. More than enough for daily use.

> **Security note:** All API keys are stored in your browser's localStorage — they never leave your device. This app makes no external requests except directly to the official APIs you configure.

---

## Competitor Analysis
The Competitor Intelligence feature uses AI to analyse fitness creators' known public strategies and generate a "clone plan" adapted for your brand and audience. This approach is used because official social media APIs don't expose competitor post-level metrics to third parties.

---

## Tech Stack
- React 18 + Vite
- Tailwind CSS
- React Router v6
- Recharts (data visualisation)
- Lucide React (icons)
- Anthropic Claude API (AI generation)

---

## License
Personal use only.
