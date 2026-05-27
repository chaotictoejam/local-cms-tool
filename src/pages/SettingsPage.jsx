import { useState } from 'react'

export default function SettingsPage({ settings, configState }) {
  const { apiKey, setApiKey } = settings
  const { config, error: configError, reload: reloadConfig } = configState

  const [keyInput, setKeyInput] = useState(apiKey)
  const [keySaved, setKeySaved] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [showConfig, setShowConfig] = useState(false)

  const handleSaveKey = () => {
    setApiKey(keyInput.trim())
    setKeySaved(true)
    setTimeout(() => setKeySaved(false), 2000)
  }

  const handleClearKey = () => {
    setApiKey('')
    setKeyInput('')
  }

  return (
    <div className="flex-1 px-6 py-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Settings</h1>
      <p className="text-sm text-gray-500 mb-8">Manage your API key and review your config.</p>

      <section className="mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Anthropic API Key</h2>
        <p className="text-sm text-gray-500 mb-3">
          Used only for Claude draft generation. Stored in <code className="bg-gray-100 px-1 rounded text-xs">localStorage</code> — never committed to any file.
        </p>

        <div className="flex gap-2 mb-2">
          <div className="relative flex-1">
            <input
              type={showKey ? 'text' : 'password'}
              value={keyInput}
              onChange={(e) => { setKeyInput(e.target.value); setKeySaved(false) }}
              placeholder="sk-ant-…"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-indigo-400 pr-10"
            />
            <button
              onClick={() => setShowKey((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              title={showKey ? 'Hide' : 'Show'}
            >
              {showKey ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          <button
            onClick={handleSaveKey}
            disabled={!keyInput.trim()}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors min-w-20"
          >
            {keySaved ? 'Saved!' : 'Save'}
          </button>

          {apiKey && (
            <button
              onClick={handleClearKey}
              className="px-3 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50"
            >
              Clear
            </button>
          )}
        </div>

        {apiKey ? (
          <p className="text-xs text-green-600 font-medium">API key is set.</p>
        ) : (
          <p className="text-xs text-amber-600">No API key set. Draft generation will not work.</p>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Config Preview</h2>
            <p className="text-sm text-gray-500">Read from <code className="bg-gray-100 px-1 rounded text-xs">config.json</code> at runtime. Edit the file directly to make changes.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={reloadConfig}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Reload
            </button>
            <button
              onClick={() => setShowConfig((v) => !v)}
              className="text-sm text-gray-600 hover:text-gray-800 font-medium"
            >
              {showConfig ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {configError ? (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
            <p className="font-medium mb-1">Config not found</p>
            <p>Copy <code className="bg-amber-100 px-1 rounded">config.example.json</code> to <code className="bg-amber-100 px-1 rounded">config.json</code> in the project root and fill in your details.</p>
          </div>
        ) : showConfig ? (
          <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 text-xs overflow-x-auto max-h-96">
            {JSON.stringify(config, null, 2)}
          </pre>
        ) : (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600">
            <div className="grid grid-cols-2 gap-x-8 gap-y-1.5">
              <div><span className="text-gray-400">Creator:</span> {config?.creator?.name || '—'}</div>
              <div><span className="text-gray-400">Tagline:</span> {config?.creator?.tagline || '—'}</div>
              <div>
                <span className="text-gray-400">Platforms:</span>{' '}
                {Object.entries(config?.platforms || {})
                  .filter(([, v]) => v?.enabled)
                  .map(([k]) => k)
                  .join(', ') || '—'}
              </div>
              <div>
                <span className="text-gray-400">Content Types:</span>{' '}
                {config?.contentTypes?.length || 0} defined
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
