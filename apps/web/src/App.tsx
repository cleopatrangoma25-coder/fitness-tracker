import { Routes, Route } from 'react-router-dom'
import { AuthProvider as FirebaseAuthProvider } from './components/auth/AuthProvider'
import { AuthProvider as AppAuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { Navigation } from './components/layout/Navigation'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import WorkoutPage from './pages/WorkoutPage'
import GoalsPage from './pages/GoalsPage'
import { DebugPage } from './pages/DebugPage'

function App() {
  return (
    <FirebaseAuthProvider>
      <AppAuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/debug" element={<DebugPage />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/workout/*" 
                element={
                  <ProtectedRoute>
                    <WorkoutPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/goals" 
                element={
                  <ProtectedRoute>
                    <GoalsPage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </AppAuthProvider>
    </FirebaseAuthProvider>
  )
}

export default App 