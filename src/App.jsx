import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import CalendarPage from './pages/CalendarPage'
import NewContentPage from './pages/NewContentPage'
import SettingsPage from './pages/SettingsPage'
import { useContent } from './hooks/useContent'
import { useConfig } from './hooks/useConfig'
import { useSettings } from './hooks/useSettings'

export default function App() {
  const content = useContent()
  const configState = useConfig()
  const settings = useSettings()

  return (
    <Router>
      <Layout configState={configState}>
        <Routes>
          <Route path="/" element={
            <CalendarPage content={content} configState={configState} settings={settings} />
          } />
          <Route path="/new" element={
            <NewContentPage content={content} configState={configState} settings={settings} />
          } />
          <Route path="/settings" element={
            <SettingsPage settings={settings} configState={configState} />
          } />
        </Routes>
      </Layout>
    </Router>
  )
}
