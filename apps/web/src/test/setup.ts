import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Firebase Auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  updateProfile: vi.fn(),
  onAuthStateChanged: vi.fn(() => () => {}),
  sendPasswordResetEmail: vi.fn(),
}))

// Mock Firebase Firestore
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  collection: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  onSnapshot: vi.fn(),
  setDoc: vi.fn(),
  Timestamp: {
    fromDate: vi.fn((date) => ({ toDate: () => date })),
    now: vi.fn(() => ({ toDate: () => new Date() })),
  },
  serverTimestamp: vi.fn(() => ({ toDate: () => new Date() })),
}))

// Mock React Router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/' }),
  }
})

// Mock tRPC
vi.mock('../lib/trpc', () => ({
  trpc: {
    user: {
      getProfile: {
        useQuery: vi.fn(() => ({ data: null, isLoading: false, error: null }))
      },
      updateProfile: {
        useMutation: vi.fn(() => ({ mutate: vi.fn(), isPending: false }))
      }
    },
    workout: {
      list: {
        useQuery: vi.fn(() => ({ data: [], isLoading: false }))
      }
    },
    goal: {
      listActive: {
        useQuery: vi.fn(() => ({ data: [], isLoading: false }))
      }
    },
    useUtils: vi.fn(() => ({
      user: { getProfile: { invalidate: vi.fn() } }
    }))
  }
}))

// Mock AuthContext
vi.mock('../contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => ({
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      displayName: 'Test User',
      firstName: 'Test',
      lastName: 'User',
      role: 'USER',
      preferences: {
        units: 'METRIC',
        notifications: true,
        privacy: 'PRIVATE',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    isAuthenticated: true,
    isLoading: false,
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    updateProfile: vi.fn(),
  }),
}))

// Mock Store
vi.mock('@fitness-tracker/store', () => ({
  useAuthStore: () => ({
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      displayName: 'Test User',
      firstName: 'Test',
      lastName: 'User',
      role: 'USER',
      preferences: {
        units: 'METRIC',
        notifications: true,
        privacy: 'PRIVATE',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    isAuthenticated: true,
    isLoading: false,
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    updateProfile: vi.fn(),
    setUser: vi.fn(),
  }),
  useWorkoutStore: () => ({
    workouts: [],
    currentWorkout: null,
    addWorkout: vi.fn(),
    updateWorkout: vi.fn(),
    setCurrentWorkout: vi.fn(),
    removeWorkout: vi.fn(),
  }),
}))

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
})

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
}) 