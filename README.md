# Content Planner

A local-only content management tool for multi-platform social media planning. Plan and draft content for Instagram, YouTube, LinkedIn, Threads, Bluesky, and podcasts — all from a single interface, with AI-assisted drafts via the Claude API.

**This tool does not post to any platform.** It has no OAuth integrations, no remote database, and no cloud sync. Everything runs locally.

---

## What it does

- **Content calendar** — board (kanban) and list views of all planned content, filterable by platform and status
- **Draft generation** — paste in source material (podcast notes, a talk abstract, a tutorial description), select your target platforms, and generate platform-specific draft posts via Claude
- **Inline editing** — review and edit each generated draft before saving
- **Status tracking** — move items through Draft → Ready → Scheduled → Published
- **Local persistence** — content is stored in `data/content.json` on your machine

---

## Setup

```bash
# 1. Clone and install
git clone <repo-url>
cd content-planner
npm install

# 2. Create your personal config
cp config.example.json config.json

# 3. Fill in config.json with your details
#    (see "Configuring your profile" below)

# 4. Start the dev server
npm run dev

# 5. Add your Anthropic API key
#    Open http://localhost:5173, go to Settings, and enter your API key.
#    It is stored only in your browser's localStorage — never committed.
```

---

## Configuring your profile

Edit `config.json` (never committed to git):

```jsonc
{
  "creator": {
    "name": "Your Name",
    "tagline": "One-line description of your work",
    "voice": {
      "dos": ["Be direct", "Use concrete examples"],
      "donts": ["Avoid jargon", "Don't oversell"],
      "neverStart": ["Just", "So,", "Hey everyone"]
    },
    "sites": {
      "professional": "https://yoursite.com",
      "community": "https://community.yoursite.com"
    }
  },
  "platforms": {
    "instagram": { "enabled": true, "handle": "@yourhandle" },
    "youtube": { "enabled": true, "channelUrl": "https://youtube.com/@yourchannel" },
    "linkedin": { "enabled": true, "handle": "yourname" },
    "threads": { "enabled": true, "handle": "@yourhandle" },
    "bluesky": { "enabled": true, "handle": "@yourhandle.bsky.social" },
    "podcast": {
      "enabled": true,
      "shows": [
        { "name": "Your Show", "spotifyUrl": "...", "appleUrl": "..." }
      ]
    }
  },
  "contentTypes": [
    "Tutorial",
    "Thought Leadership",
    "Behind the Scenes",
    "Podcast Clip",
    "Announcement"
  ],
  "platformRules": {
    "instagram": "Max 2200 characters. Use line breaks for readability. End with a call to action. Include 3–5 relevant hashtags at the end.",
    "youtube": "Write a community post or video description. Lead with the hook. Keep it under 300 words.",
    "linkedin": "Professional tone. Lead with insight, not announcement. Max 3000 characters. No hashtag spam.",
    "threads": "Conversational. Max 500 characters. Can be a take, a question, or a one-liner.",
    "bluesky": "Max 300 characters. Punchy and direct.",
    "podcast": "Write a short episode description or teaser. 100–200 words. Mention the guest if applicable."
  }
}
```

### Adding a new platform

Add the platform to both `platforms` and `platformRules` in `config.json`. The app reads these at runtime, so no code changes are needed.

### Adding a new content type

Add a string to the `contentTypes` array in `config.json`. It will appear in the content type dropdown immediately on next page load.

---

## Data storage

- `config.json` — your personal creator profile and platform rules. **Gitignored by design.**
- `data/content.json` — your content calendar data. **Gitignored by design.** Created automatically on first run. Back it up manually if needed.

Neither file is ever sent anywhere. The only outbound request this app makes is to the Anthropic API when you click "Generate Drafts."

---

## API key

Your Anthropic API key is entered in Settings and stored in `localStorage` only. It is never written to any file and never leaves your browser except in requests to the Anthropic API (proxied through the local Vite dev server).

Get a key at [console.anthropic.com](https://console.anthropic.com).
