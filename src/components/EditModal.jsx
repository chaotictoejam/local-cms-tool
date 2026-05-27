import { useState } from 'react'
import PlatformBadge from './PlatformBadge'
import { STATUSES } from './StatusBadge'
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

export default function EditModal({ item, config, apiKey, enabledPlatforms, onSave, onDelete, onClose }) {
  const [form, setForm] = useState({
    title: item.title || '',
    contentType: item.contentType || '',
    platforms: item.platforms || [],
    status: item.status || 'draft',
    targetDate: item.targetDate || '',
    publishedDate: item.publishedDate || '',
    notes: item.notes || '',
    sourceMaterial: item.sourceMaterial || '',
    drafts: { ...(item.drafts || {}) },
  })
  const [tab, setTab] = useState('details')
  const [showAiAssist, setShowAiAssist] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const togglePlatform = (p) => {
    set('platforms', form.platforms.includes(p)
      ? form.platforms.filter((x) => x !== p)
      : [...form.platforms, p])
  }

  const handleGenerate = async () => {
    if (!apiKey) { setGenError('No API key — add it in Settings.'); return }
    setGenerating(true)
    setGenError(null)
    try {
      const result = await generateDrafts({
        sourceMaterial: form.sourceMaterial,
        config: config.config,
        selectedPlatforms: form.platforms,
        contentType: form.contentType,
        apiKey,
      })
      set('drafts', { ...form.drafts, ...result })
      setShowAiAssist(false)
    } catch (e) {
      setGenError(e.message)
    } finally {
      setGenerating(false)
    }
  }

  const handleSave = () => {
    const updates = {
      ...form,
      publishedDate: form.status === 'published' && !form.publishedDate
        ? new Date().toISOString().split('T')[0]
        : form.publishedDate || null,
    }
    onSave(item.id, updates)
    onClose()
  }

  const contentTypes = config.config?.contentTypes || []

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">Edit Item</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex gap-0 border-b border-gray-200 px-6">
          {['details', 'drafts'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px capitalize transition-colors ${
                tab === t
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              {t === 'details' ? 'Details' : 'Drafts'}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {tab === 'details' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => set('title', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                  <input
                    type="date"
                    value={form.targetDate}
                    onChange={(e) => set('targetDate', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
                  />
                </div>
                {form.status === 'published' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Published Date</label>
                    <input
                      type="date"
                      value={form.publishedDate}
                      onChange={(e) => set('publishedDate', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Platforms</label>
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => set('notes', e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 resize-none"
                  placeholder="Internal notes, links, context…"
                />
              </div>
            </div>
          )}

          {tab === 'drafts' && (
            <div className="space-y-4">
              {form.platforms.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">
                  Select platforms in Details first.
                </p>
              ) : (
                <>
                  <div className="flex justify-end">
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
                    <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-3">
                      <label className="block text-xs font-medium text-indigo-800">
                        Source material for AI generation
                      </label>
                      <textarea
                        value={form.sourceMaterial}
                        onChange={(e) => set('sourceMaterial', e.target.value)}
                        rows={4}
                        className="w-full border border-indigo-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-indigo-400 resize-none"
                        placeholder="Paste podcast notes, script excerpt, talk abstract…"
                      />
                      {genError && (
                        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1">{genError}</p>
                      )}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleGenerate}
                          disabled={generating || !form.sourceMaterial.trim()}
                          className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
                        >
                          {generating && (
                            <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                          )}
                          {generating ? 'Generating…' : 'Generate'}
                        </button>
                        <button onClick={() => setShowAiAssist(false)} className="text-xs text-indigo-600 hover:text-indigo-800">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {form.platforms.map((p) => (
                    <div key={p}>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-medium text-gray-600">{PLATFORM_LABELS[p] || p}</label>
                        <span className="text-xs text-gray-400">{(form.drafts[p] || '').length} chars</span>
                      </div>
                      <textarea
                        value={form.drafts[p] || ''}
                        onChange={(e) => set('drafts', { ...form.drafts, [p]: e.target.value })}
                        rows={4}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 resize-y"
                        placeholder={`Write your ${PLATFORM_LABELS[p] || p} post here…`}
                      />
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-red-600">Delete this item?</span>
              <button onClick={() => { onDelete(item.id); onClose() }} className="text-sm font-medium text-red-600 hover:text-red-800">Yes</button>
              <button onClick={() => setConfirmDelete(false)} className="text-sm text-gray-500">Cancel</button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} className="text-sm text-red-400 hover:text-red-600">
              Delete
            </button>
          )}
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
