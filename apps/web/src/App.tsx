import { Routes, Route } from 'react-router-dom'
import { AuthProvider as FirebaseAuthProvider } from './components/auth/AuthProvider'
import { AuthProvider as AppAuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { Navigation } from './components/layout/Navigation'
import { VStack } from '@fitness-tracker/ui'
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
        <ThemeProvider>
          <VStack className="min-h-screen h-screen w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Navigation />
            <main className="flex-1 overflow-auto w-full">
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
          </VStack>
        </ThemeProvider>
      </AppAuthProvider>
    </FirebaseAuthProvider>
  )
}

export default App 