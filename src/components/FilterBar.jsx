import { STATUS_CONFIG, STATUSES } from './StatusBadge'

const PLATFORM_LABELS = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  threads: 'Threads',
  bluesky: 'Bluesky',
  podcast: 'Podcast',
}

export default function FilterBar({ platforms, filters, onFiltersChange, viewMode, onViewModeChange }) {
  const toggle = (type, value) => {
    const current = filters[type]
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    onFiltersChange({ ...filters, [type]: next })
  }

  const hasFilters = filters.platforms.length > 0 || filters.statuses.length > 0

  return (
    <div className="flex flex-wrap items-center gap-3 py-3">
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Platform</span>
        {platforms.map((p) => (
          <button
            key={p}
            onClick={() => toggle('platforms', p)}
            className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
              filters.platforms.includes(p)
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'
            }`}
          >
            {PLATFORM_LABELS[p] || p}
          </button>
        ))}
      </div>

      <div className="w-px h-5 bg-gray-200 hidden sm:block" />

      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</span>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => toggle('statuses', s)}
            className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
              filters.statuses.includes(s)
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'
            }`}
          >
            {STATUS_CONFIG[s].label}
          </button>
        ))}
      </div>

      {hasFilters && (
        <button
          onClick={() => onFiltersChange({ platforms: [], statuses: [] })}
          className="text-xs text-gray-500 hover:text-gray-700 underline"
        >
          Clear filters
        </button>
      )}

      <div className="ml-auto flex items-center gap-1 border border-gray-300 rounded-lg p-0.5 bg-white">
        <button
          onClick={() => onViewModeChange('kanban')}
          title="Kanban view"
          className={`p-1.5 rounded transition-colors ${viewMode === 'kanban' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="3" width="5" height="18" rx="1" />
            <rect x="10" y="3" width="5" height="14" rx="1" />
            <rect x="17" y="3" width="5" height="11" rx="1" />
          </svg>
        </button>
        <button
          onClick={() => onViewModeChange('list')}
          title="List view"
          className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}
