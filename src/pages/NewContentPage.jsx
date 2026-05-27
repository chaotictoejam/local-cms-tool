import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PlatformBadge from '../components/PlatformBadge'
import { STATUSES } from '../components/StatusBadge'
import { generateDrafts } from '../utils/api'

const PLATFORM_LABELS = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  threads: 'Threads',
  bluesky: 'Bluesky',
  podcast: 'Podcast',
  devto: 'DEV',
  medium: 'Medium',
}

export default function NewContentPage({ content, configState, settings }) {
  const navigate = useNavigate()
  const { config, enabledPlatforms } = configState
  const contentTypes = config?.contentTypes || []

  const [form, setForm] = useState({
    title: '',
    contentType: '',
    platforms: [],
    status: 'draft',
    targetDate: '',
    notes: '',
  })
  const [drafts, setDrafts] = useState({})
  const [showAiAssist, setShowAiAssist] = useState(false)
  const [sourceMaterial, setSourceMaterial] = useState('')
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState(null)

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const togglePlatform = (p) => {
    set('platforms', form.platforms.includes(p)
      ? form.platforms.filter((x) => x !== p)
      : [...form.platforms, p])
  }

  const handleGenerate = async () => {
    if (!settings?.apiKey) {
      setGenError('No API key set — add it in Settings first.')
      return
    }
    setGenerating(true)
    setGenError(null)
    try {
      const result = await generateDrafts({
        sourceMaterial,
        config,
        selectedPlatforms: form.platforms,
        contentType: form.contentType,
        apiKey: settings.apiKey,
      })
      setDrafts((d) => ({ ...d, ...result }))
      setShowAiAssist(false)
    } catch (e) {
      setGenError(e.message)
    } finally {
      setGenerating(false)
    }
  }

  const handleSave = async () => {
    const item = {
      id: crypto.randomUUID(),
      ...form,
      title: form.title.trim() || 'Untitled',
      sourceMaterial,
      drafts,
    }
    await content.addItem(item)
    navigate('/')
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-6 py-5 border-b border-gray-200 bg-white sticky top-0 z-10 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">New Content Item</h1>
          <p className="text-sm text-gray-400 mt-0.5">Plan and draft content for your platforms.</p>
        </div>
        <button
          onClick={handleSave}
          className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Save Item
        </button>
      </div>

      <div className="px-6 py-6 max-w-2xl space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            autoFocus
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
            placeholder="Post title or reference name"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
            <select
              value={form.contentType}
              onChange={(e) => set('contentType', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 bg-white"
            >
              <option value="">— type —</option>
              {contentTypes.map((ct) => <option key={ct} value={ct}>{ct}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => set('status', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 bg-white"
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
            <input
              type="date"
              value={form.targetDate}
              onChange={(e) => set('targetDate', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Platforms</label>
          {enabledPlatforms.length === 0 ? (
            <p className="text-sm text-gray-400">No platforms enabled in config.json.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {enabledPlatforms.map((p) => (
                <button
                  key={p}
                  onClick={() => togglePlatform(p)}
                  className={`rounded transition-opacity ${
                    form.platforms.includes(p)
                      ? 'opacity-100 ring-2 ring-indigo-400 ring-offset-1'
                      : 'opacity-40 hover:opacity-70'
                  }`}
                >
                  <PlatformBadge platform={p} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            rows={2}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 resize-none"
            placeholder="Internal notes, ideas, links…"
          />
        </div>

        {form.platforms.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900">Drafts</h2>
              <button
                onClick={() => setShowAiAssist((v) => !v)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate with AI
              </button>
            </div>

            {showAiAssist && (
              <div className="mb-4 p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-3">
                <div>
                  <label className="block text-xs font-medium text-indigo-800 mb-1">
                    Source material
                  </label>
                  <textarea
                    value={sourceMaterial}
                    onChange={(e) => setSourceMaterial(e.target.value)}
                    rows={5}
                    className="w-full border border-indigo-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-indigo-400 resize-none"
                    placeholder="Paste podcast notes, script excerpt, talk abstract, tutorial description…"
                  />
                </div>
                {genError && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1">{genError}</p>
                )}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleGenerate}
                    disabled={generating || !sourceMaterial.trim()}
                    className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
                  >
                    {generating && (
                      <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    )}
                    {generating ? 'Generating…' : 'Generate Drafts'}
                  </button>
                  <button
                    onClick={() => setShowAiAssist(false)}
                    className="text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    Cancel
                  </button>
                  {!settings?.apiKey && (
                    <span className="text-xs text-amber-600 ml-1">
                      No API key — <a href="/settings" className="underline">add in Settings</a>
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {form.platforms.map((p) => (
                <div key={p}>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-gray-600">
                      {PLATFORM_LABELS[p] || p}
                    </label>
                    <span className="text-xs text-gray-400">
                      {(drafts[p] || '').length} chars
                    </span>
                  </div>
                  <textarea
                    value={drafts[p] || ''}
                    onChange={(e) => setDrafts((d) => ({ ...d, [p]: e.target.value }))}
                    rows={4}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 resize-y"
                    placeholder={`Write your ${PLATFORM_LABELS[p] || p} post here…`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pb-8 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Save Item
          </button>
        </div>
      </div>
    </div>
  )
}
