import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Auth from './components/Auth'
import Home from './pages/Home'
import Admin from './pages/Admin'
import AdminEvents from './pages/AdminEvents'
import Events from './pages/Events'
import ProtectedRoute from './components/ProtectedRoute'
import PlanReminderWidget from './components/PlanReminderWidget'
import { isAdmin } from './utils/jwt'

function AdminRoute({ children }) {
  if (!isAdmin()) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <Router>
      <PlanReminderWidget />
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminRoute><Admin /></AdminRoute></ProtectedRoute>} />
        <Route path="/admin/events" element={<ProtectedRoute><AdminRoute><AdminEvents /></AdminRoute></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}
