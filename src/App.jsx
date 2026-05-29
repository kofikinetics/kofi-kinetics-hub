import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import MyAnalytics from './pages/MyAnalytics'
import ContentIdeas from './pages/ContentIdeas'
import Competitors from './pages/Competitors'
import StrategyHub from './pages/StrategyHub'
import Settings from './pages/Settings'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="analytics" element={<MyAnalytics />} />
        <Route path="ideas" element={<ContentIdeas />} />
        <Route path="competitors" element={<Competitors />} />
        <Route path="strategy" element={<StrategyHub />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
