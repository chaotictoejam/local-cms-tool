import PlatformBadge from './PlatformBadge'
import StatusBadge, { STATUSES } from './StatusBadge'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function ListView({ items, onEdit, onStatusChange }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-sm">No content items yet.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Type</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Platforms</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Target Date</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((item) => (
            <tr key={item.id} className="bg-white hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                <button
                  onClick={() => onEdit(item)}
                  className="font-medium text-gray-900 hover:text-indigo-600 text-left"
                >
                  {item.title || <span className="text-gray-400 italic">Untitled</span>}
                </button>
              </td>
              <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                {item.contentType || '—'}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {item.platforms?.map((p) => (
                    <PlatformBadge key={p} platform={p} size="xs" />
                  ))}
                </div>
              </td>
              <td className="px-4 py-3">
                <select
                  value={item.status}
                  onChange={(e) => onStatusChange(item.id, e.target.value)}
                  className="text-xs border border-gray-200 rounded px-2 py-1 bg-white focus:outline-none focus:border-indigo-400"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                {formatDate(item.targetDate)}
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => onEdit(item)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
