import { Routes, Route } from 'react-router-dom'
import { AuthProvider as FirebaseAuthProvider } from './components/auth/AuthProvider'
import { AuthProvider as AppAuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { Navigation } from './components/layout/Navigation'
import { lazy, Suspense } from 'react'
import { Loading } from '@fitness-tracker/ui'

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const WorkoutPage = lazy(() => import('./pages/WorkoutPage'))
const GoalsPage = lazy(() => import('./pages/GoalsPage'))
const DebugPage = lazy(() => import('./pages/DebugPage').then(module => ({ default: module.DebugPage })))

function App() {
  return (
    <FirebaseAuthProvider>
      <AppAuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <Suspense fallback={<Loading text="Loading..." />}>
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
            </Suspense>
          </main>
        </div>
      </AppAuthProvider>
    </FirebaseAuthProvider>
  )
}

export default App 