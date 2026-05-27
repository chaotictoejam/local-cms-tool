import { useState } from 'react'
import DraftPanel from './DraftPanel'
import PlatformBadge from './PlatformBadge'
import { STATUSES } from './StatusBadge'
import { generateDrafts } from '../utils/api'

export default function EditModal({ item, config, apiKey, enabledPlatforms, onSave, onDelete, onClose }) {
  const [form, setForm] = useState({
    title: item.title || '',
    contentType: item.contentType || '',
    platforms: item.platforms || [],
    status: item.status || 'draft',
    targetDate: item.targetDate || '',
    publishedDate: item.publishedDate || '',
    sourceMaterial: item.sourceMaterial || '',
    notes: item.notes || '',
    drafts: { ...(item.drafts || {}) },
  })
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState(null)
  const [tab, setTab] = useState('info')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const togglePlatform = (p) => {
    set('platforms', form.platforms.includes(p)
      ? form.platforms.filter((x) => x !== p)
      : [...form.platforms, p])
  }

  const handleGenerate = async () => {
    if (!form.sourceMaterial.trim()) return
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
      setTab('drafts')
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
          <h2 className="text-lg font-semibold text-gray-900">Edit Content Item</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex gap-0 border-b border-gray-200 px-6">
          {['info', 'source', 'drafts'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-2.5 text-sm font-medium border-b-2 -mb-px capitalize transition-colors ${
                tab === t
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              {t === 'info' ? 'Details' : t === 'source' ? 'Source' : 'Drafts'}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {tab === 'info' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => set('title', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
                  placeholder="Post title or reference"
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
                    <option value="">— select type —</option>
                    {contentTypes.map((ct) => (
                      <option key={ct} value={ct}>{ct}</option>
                    ))}
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
                      className={`transition-opacity ${form.platforms.includes(p) ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
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
                  placeholder="Internal notes, ideas, context…"
                />
              </div>
            </div>
          )}

          {tab === 'source' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source Material</label>
                <textarea
                  value={form.sourceMaterial}
                  onChange={(e) => set('sourceMaterial', e.target.value)}
                  rows={10}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 resize-none"
                  placeholder="Paste podcast notes, script excerpt, talk abstract, tutorial description…"
                />
              </div>
              {genError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{genError}</p>
              )}
              <button
                onClick={handleGenerate}
                disabled={generating || !form.sourceMaterial.trim() || form.platforms.length === 0}
                className="w-full py-2 px-4 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {generating ? 'Generating…' : 'Regenerate Drafts'}
              </button>
            </div>
          )}

          {tab === 'drafts' && (
            <div className="h-80">
              {form.platforms.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">Select platforms in the Details tab first.</p>
              ) : (
                <DraftPanel
                  platforms={form.platforms}
                  drafts={form.drafts}
                  onChange={(p, val) => set('drafts', { ...form.drafts, [p]: val })}
                />
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-red-600">Delete this item?</span>
              <button onClick={() => { onDelete(item.id); onClose() }} className="text-sm font-medium text-red-600 hover:text-red-800">Yes, delete</button>
              <button onClick={() => setConfirmDelete(false)} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} className="text-sm text-red-500 hover:text-red-700">
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
