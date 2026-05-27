import PlatformBadge from './PlatformBadge'
import StatusBadge, { STATUSES } from './StatusBadge'

function formatDate(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function ContentCard({ item, onEdit, onStatusChange }) {
  const nextStatus = STATUSES[STATUSES.indexOf(item.status) + 1]

  const handleStatusChange = (e) => {
    e.stopPropagation()
    onStatusChange(item.id, e.target.value)
  }

  return (
    <div
      onClick={() => onEdit(item)}
      className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-medium text-gray-900 leading-snug line-clamp-2 flex-1">
          {item.title || <span className="text-gray-400 italic">Untitled</span>}
        </p>
      </div>

      {item.contentType && (
        <p className="text-xs text-gray-500 mb-2">{item.contentType}</p>
      )}

      {item.platforms?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {item.platforms.map((p) => (
            <PlatformBadge key={p} platform={p} size="xs" />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between gap-2 mt-2">
        <select
          value={item.status}
          onChange={handleStatusChange}
          onClick={(e) => e.stopPropagation()}
          className="text-xs border border-gray-200 rounded px-1.5 py-0.5 text-gray-600 bg-white focus:outline-none focus:border-indigo-400"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>

        {item.targetDate && (
          <span className="text-xs text-gray-400">{formatDate(item.targetDate)}</span>
        )}
      </div>
    </div>
  )
}
