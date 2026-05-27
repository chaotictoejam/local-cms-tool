export const STATUS_CONFIG = {
  draft: { label: 'Draft', style: 'bg-gray-100 text-gray-700 border border-gray-300' },
  ready: { label: 'Ready', style: 'bg-blue-100 text-blue-700 border border-blue-300' },
  scheduled: { label: 'Scheduled', style: 'bg-amber-100 text-amber-700 border border-amber-300' },
  published: { label: 'Published', style: 'bg-green-100 text-green-700 border border-green-300' },
}

export const STATUSES = ['draft', 'ready', 'scheduled', 'published']

export default function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.draft
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${cfg.style}`}>
      {cfg.label}
    </span>
  )
}
