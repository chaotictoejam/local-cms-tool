import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DraftPanel from '../components/DraftPanel'
import PlatformBadge from '../components/PlatformBadge'
import { generateDrafts } from '../utils/api'

function generateId() {
  return crypto.randomUUID()
}

export default function NewContentPage({ content, configState, settings }) {
  const navigate = useNavigate()
  const { config, enabledPlatforms } = configState
  const contentTypes = config?.contentTypes || []

  const [form, setForm] = useState({
    title: '',
    contentType: '',
    platforms: [],
    targetDate: '',
    notes: '',
    sourceMaterial: '',
  })
  const [drafts, setDrafts] = useState({})
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState(null)
  const [saving, setSaving] = useState(false)

  const hasDrafts = Object.keys(drafts).length > 0
  const canGenerate = form.sourceMaterial.trim().length > 0 && form.platforms.length > 0

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const togglePlatform = (p) => {
    set('platforms', form.platforms.includes(p)
      ? form.platforms.filter((x) => x !== p)
      : [...form.platforms, p])
  }

  const handleGenerate = async () => {
    if (!settings?.apiKey) {
      setGenError('No API key set. Go to Settings and enter your Anthropic API key.')
      return
    }
    setGenerating(true)
    setGenError(null)
    try {
      const result = await generateDrafts({
        sourceMaterial: form.sourceMaterial,
        config,
        selectedPlatforms: form.platforms,
        contentType: form.contentType,
        apiKey: settings.apiKey,
      })
      setDrafts(result)
    } catch (e) {
      setGenError(e.message)
    } finally {
      setGenerating(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    const item = {
      id: generateId(),
      title: form.title.trim() || 'Untitled',
      contentType: form.contentType,
      platforms: form.platforms,
      status: 'draft',
      targetDate: form.targetDate || null,
      publishedDate: null,
      sourceMaterial: form.sourceMaterial,
      notes: form.notes,
      drafts,
    }
    await content.addItem(item)
    navigate('/')
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="px-6 py-5 border-b border-gray-200 bg-white">
        <h1 className="text-2xl font-bold text-gray-900">New Content Item</h1>
        <p className="text-sm text-gray-500 mt-0.5">Paste source material, select platforms, and generate drafts.</p>
      </div>

      <div className={`flex-1 flex min-h-0 ${hasDrafts ? 'flex-col lg:flex-row' : ''}`}>
        <div className={`overflow-y-auto px-6 py-5 space-y-5 ${hasDrafts ? 'lg:w-1/2 lg:border-r border-gray-200' : 'max-w-2xl'}`}>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source Material <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.sourceMaterial}
              onChange={(e) => set('sourceMaterial', e.target.value)}
              rows={8}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 resize-none"
              placeholder="Paste podcast notes, script excerpt, talk abstract, tutorial description…"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Platforms <span className="text-red-500">*</span>
            </label>
            {enabledPlatforms.length === 0 ? (
              <p className="text-sm text-gray-400">No platforms enabled. Add platforms to config.json.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {enabledPlatforms.map((p) => (
                  <button
                    key={p}
                    onClick={() => togglePlatform(p)}
                    className={`transition-opacity rounded ${form.platforms.includes(p) ? 'opacity-100 ring-2 ring-indigo-400 ring-offset-1' : 'opacity-50 hover:opacity-80'}`}
                  >
                    <PlatformBadge platform={p} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
              <select
                value={form.contentType}
                onChange={(e) => set('contentType', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 bg-white"
              >
                <option value="">— select type —</option>
                {contentTypes.map((ct) => (
                  <option key={ct} value={ct}>{ct}</option>
                ))}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
              placeholder="Post title or reference name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 resize-none"
              placeholder="Internal notes…"
            />
          </div>

          {genError && (
            <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {genError}
            </div>
          )}

          {!settings?.apiKey && (
            <div className="px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
              No API key set — <a href="/settings" className="underline font-medium">add it in Settings</a> to generate drafts.
            </div>
          )}

          <div className="flex gap-3 pb-4">
            <button
              onClick={handleGenerate}
              disabled={generating || !canGenerate}
              className="flex-1 py-2 px-4 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {generating && (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              {generating ? 'Generating…' : hasDrafts ? 'Regenerate Drafts' : 'Generate Drafts'}
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="py-2 px-4 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Save Without Drafts
            </button>
          </div>
        </div>

        {hasDrafts && (
          <div className="lg:w-1/2 flex flex-col min-h-0 px-6 py-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-gray-900">Generated Drafts</h2>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving…' : 'Save All'}
              </button>
            </div>
            <div className="flex-1 border border-gray-200 rounded-xl overflow-hidden flex flex-col">
              <DraftPanel
                platforms={form.platforms}
                drafts={drafts}
                onChange={(p, val) => setDrafts((d) => ({ ...d, [p]: val }))}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
