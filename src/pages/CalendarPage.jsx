import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import FilterBar from '../components/FilterBar'
import KanbanView from '../components/KanbanView'
import ListView from '../components/ListView'
import EditModal from '../components/EditModal'

export default function CalendarPage({ content, configState, settings }) {
  const [viewMode, setViewMode] = useState('kanban')
  const [filters, setFilters] = useState({ platforms: [], statuses: [] })
  const [editingItem, setEditingItem] = useState(null)

  const { items, loading, error, updateItem, deleteItem } = content
  const { config, enabledPlatforms } = configState

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const platformMatch = filters.platforms.length === 0
        || item.platforms?.some((p) => filters.platforms.includes(p))
      const statusMatch = filters.statuses.length === 0
        || filters.statuses.includes(item.status)
      return platformMatch && statusMatch
    })
  }, [items, filters])

  const handleStatusChange = (id, status) => {
    updateItem(id, {
      status,
      ...(status === 'published' ? { publishedDate: new Date().toISOString().split('T')[0] } : {}),
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-gray-400">Loading…</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col px-6 py-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Calendar</h1>
          <p className="text-sm text-gray-500 mt-0.5">{items.length} item{items.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          to="/new"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New
        </Link>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <FilterBar
        platforms={enabledPlatforms}
        filters={filters}
        onFiltersChange={setFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-24">
          <svg className="w-12 h-12 text-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500 font-medium mb-1">No content yet</p>
          <p className="text-sm text-gray-400 mb-4">Create your first content item to get started.</p>
          <Link to="/new" className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
            Create Content
          </Link>
        </div>
      ) : viewMode === 'kanban' ? (
        <KanbanView items={filtered} onEdit={setEditingItem} onStatusChange={handleStatusChange} />
      ) : (
        <ListView items={filtered} onEdit={setEditingItem} onStatusChange={handleStatusChange} />
      )}

      {editingItem && (
        <EditModal
          item={editingItem}
          config={configState}
          apiKey={settings?.apiKey || ''}
          enabledPlatforms={enabledPlatforms}
          onSave={(id, updates) => { updateItem(id, updates); setEditingItem(null) }}
          onDelete={(id) => { deleteItem(id); setEditingItem(null) }}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  )
}
