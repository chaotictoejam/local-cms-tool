import ContentCard from './ContentCard'
import { STATUSES, STATUS_CONFIG } from './StatusBadge'

const COLUMN_STYLES = {
  draft: 'bg-gray-50 border-gray-200',
  ready: 'bg-blue-50 border-blue-200',
  scheduled: 'bg-amber-50 border-amber-200',
  published: 'bg-green-50 border-green-200',
}

const HEADER_STYLES = {
  draft: 'text-gray-700',
  ready: 'text-blue-700',
  scheduled: 'text-amber-700',
  published: 'text-green-700',
}

export default function KanbanView({ items, onEdit, onStatusChange }) {
  const byStatus = STATUSES.reduce((acc, s) => {
    acc[s] = items.filter((item) => item.status === s)
    return acc
  }, {})

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 min-h-96">
      {STATUSES.map((status) => (
        <div
          key={status}
          className={`rounded-xl border ${COLUMN_STYLES[status]} p-3 flex flex-col gap-2`}
        >
          <div className="flex items-center justify-between mb-1">
            <h3 className={`text-sm font-semibold ${HEADER_STYLES[status]}`}>
              {STATUS_CONFIG[status].label}
            </h3>
            <span className="text-xs text-gray-400 font-medium">
              {byStatus[status].length}
            </span>
          </div>

          {byStatus[status].length === 0 && (
            <p className="text-xs text-gray-400 text-center py-6">No items</p>
          )}

          {byStatus[status].map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              onEdit={onEdit}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
