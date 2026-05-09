import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Auth from './components/Auth'
import Home from './pages/Home'
import Admin from './pages/Admin'
import ProtectedRoute from './components/ProtectedRoute'
import { isAdmin } from './utils/jwt'

function AdminRoute({ children }) {
  if (!isAdmin()) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminRoute><Admin /></AdminRoute></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}
