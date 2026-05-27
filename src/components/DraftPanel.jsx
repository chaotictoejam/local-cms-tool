import { useState } from 'react'

const PLATFORM_LABELS = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  threads: 'Threads',
  bluesky: 'Bluesky',
  podcast: 'Podcast',
}

export default function DraftPanel({ platforms, drafts, onChange }) {
  const [activeTab, setActiveTab] = useState(platforms[0] || '')
  const [copied, setCopied] = useState(null)

  const handleCopy = async (platform) => {
    await navigator.clipboard.writeText(drafts[platform] || '')
    setCopied(platform)
    setTimeout(() => setCopied(null), 1500)
  }

  if (!platforms.length) return null

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-0.5 border-b border-gray-200 overflow-x-auto">
        {platforms.map((p) => (
          <button
            key={p}
            onClick={() => setActiveTab(p)}
            className={`px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
              activeTab === p
                ? 'text-indigo-600 border-indigo-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            {PLATFORM_LABELS[p] || p}
          </button>
        ))}
      </div>

      {platforms.map((p) => (
        <div key={p} className={`flex-1 flex flex-col ${activeTab === p ? '' : 'hidden'}`}>
          <div className="flex items-center justify-between px-1 py-2">
            <span className="text-xs text-gray-500">
              {(drafts[p] || '').length} chars
            </span>
            <button
              onClick={() => handleCopy(p)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              {copied === p ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <textarea
            value={drafts[p] || ''}
            onChange={(e) => onChange(p, e.target.value)}
            className="flex-1 w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-800 resize-none focus:outline-none focus:border-indigo-400 min-h-48"
            placeholder={`Draft for ${PLATFORM_LABELS[p] || p}…`}
          />
        </div>
      ))}
    </div>
  )
}
