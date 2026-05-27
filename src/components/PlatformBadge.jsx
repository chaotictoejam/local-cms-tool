const PLATFORM_STYLES = {
  instagram: 'bg-pink-500 text-white',
  youtube: 'bg-red-600 text-white',
  linkedin: 'bg-blue-700 text-white',
  threads: 'bg-gray-900 text-white',
  bluesky: 'bg-sky-500 text-white',
  podcast: 'bg-purple-600 text-white',
  devto: 'bg-zinc-800 text-white',
  medium: 'bg-emerald-700 text-white',
}

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

export default function PlatformBadge({ platform, size = 'sm' }) {
  const style = PLATFORM_STYLES[platform] || 'bg-gray-400 text-white'
  const label = PLATFORM_LABELS[platform] || platform
  const padding = size === 'xs' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-0.5 text-xs'

  return (
    <span className={`inline-block rounded font-medium ${padding} ${style}`}>
      {label}
    </span>
  )
}
