import { Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Loading } from '@fitness-tracker/ui'
import { 
  AuthProvider as FirebaseAuthProvider,
  ProtectedRoute,
  Navigation 
} from './components/stacks/__index'
import { AuthProvider as AppAuthProvider } from './contexts/AuthContext'

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const WorkoutPage = lazy(() => import('./pages/WorkoutPage'))
const GoalsPage = lazy(() => import('./pages/GoalsPage'))
const DebugPage = lazy(() => import('./pages/DebugPage').then(module => ({ default: module.DebugPage })))

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  const isHomePage = location.pathname === '/';

  return (
    <FirebaseAuthProvider>
      <AppAuthProvider>
        <div className="min-h-screen w-full bg-gray-50">
          {!isAuthPage && !isHomePage && <Navigation />}
          {isAuthPage || isHomePage ? (
            // Auth and Home pages get full width without container constraints
            <main className="w-full">
              <Suspense fallback={<Loading text="Loading..." />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/auth" element={<AuthPage />} />
                </Routes>
              </Suspense>
            </main>
          ) : (
            // Other pages use full width with padding
            <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
              <Suspense fallback={<Loading text="Loading..." />}>
                <Routes>
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
          )}
        </div>
      </AppAuthProvider>
    </FirebaseAuthProvider>
  )
}

export default App 