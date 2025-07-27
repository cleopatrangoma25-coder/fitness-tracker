
# Fitness Tracker Pro - Technical Design Document

## PROJECT TITLE: Fitness Tracker Pro
**One‑sentence pitch**: A type-safe, real-time web application for logging workouts, tracking personal fitness goals, and visualizing progress with insightful analytics.

## 1. OVERVIEW

### Goal:
- Provide a fast, intuitive, and reliable platform for users to log their daily fitness activities.
- Empower users to set, track, and achieve their personal fitness goals through clear data visualization.
- Create a single source of truth for an individual's fitness journey, accessible anywhere.

### Key features:
- Secure User Authentication & Profile Management (weight, height, goals).
- End-to-end Workout Logging (Create, Read, Update, Delete).
- Personalized Dashboard with key stats and progress charts.
- Customizable Goal Setting & Tracking.
- (Future) Admin Panel for user support and analytics.

### Target users & success criteria:
- **Users**: Individuals interested in tracking their fitness, from beginners to experienced athletes.
- **Success Criteria**:
  - Onboard 500 active users within the first 6 months.
  - Achieve over 10,000 logged workouts in the first year.
  - Maintain a weekly user retention rate of over 40%.
  - Ensure a 99.9% API uptime and a sub-500ms response time for core actions.

## 2. TECH STACK (IMPLEMENTED)

The tech stack has been successfully implemented and is fully operational.

- **Runtime**: Node.js (v22 via Express server)
- **Language**: TypeScript (strict)
- **Front‑end**: React + Vite
- **UI kit**: shadcn/ui
- **Styling**: Tailwind CSS
- **State / data fetching**: TanStack Query + tRPC
- **Forms & validation**: React Hook Form + Zod resolver
- **Shared validation**: Zod (client & server)
- **API layer**: tRPC with Express backend
- **Backend services**: Firebase Auth · Firestore · Storage
- **Package manager / mono**: PNPM workspaces
- **Build orchestration**: Turborepo
- **Component workshop**: Storybook
- **Unit / component tests**: Vitest + Testing Library
- **End‑to‑end tests**: Playwright (planned)
- **Linting**: ESLint + TypeScript rules
- **Formatting**: Prettier
- **Versioning / publishing**: Changesets (planned)
- **CI / CD**: GitHub Actions

## 3. MONOREPO LAYOUT (IMPLEMENTED)

The monorepo structure provides excellent separation of concerns and code sharing.

```
.
├── apps/
│   ├── web/              ← React front-end (Dashboard, Logging, Goals)
│   │   └── src/
│   │       ├── components/
│   │       │   ├── auth/          ← Authentication components
│   │       │   ├── dashboard/     ← Dashboard components
│   │       │   ├── goals/         ← Goal management components
│   │       │   ├── layout/        ← Layout and navigation components
│   │       │   ├── notifications/ ← Notification components
│   │       │   ├── onboarding/    ← Onboarding components
│   │       │   ├── profile/       ← Profile management components
│   │       │   ├── stacks/        ← Stack-based component exports (centralized)
│   │       │   └── workout/       ← Workout management components
│   │       ├── pages/             ← Page components
│   │       ├── hooks/             ← Custom React hooks
│   │       ├── lib/               ← Service libraries
│   │       └── contexts/          ← React contexts
│   └── api/              ← Express + tRPC API server
├── packages/
│   ├── shared/           ← Zod schemas, utilities, common types
│   ├── store/            ← Zustand state management
│   └── ui/               ← Reusable UI components
├── docs/                 ← Project docs (this TDD, ADRs, etc.)
└── .github/              ← CI workflows
```

## 4. ARCHITECTURE (IMPLEMENTED)

The architecture is a modern full-stack application with type-safe API communication.

- **Client (React + TanStack Query)** ⇄ **tRPC HTTPS endpoints (Express)**
- **tRPC handlers** ⇄ **Firebase Services (Firestore, Auth)**

### API Endpoints (Implemented)
- **User Management**: Profile CRUD operations
- **Workout Management**: Create, read, update, delete workouts
- **Goal Management**: Goal setting and progress tracking

## 5. DEPLOYMENT ARCHITECTURE

### Current Implementation

**API Server**: Express + tRPC server running on Node.js
- **Development**: `http://localhost:3001`
- **Production**: Deployed via Firebase Hosting or separate hosting service

**Frontend**: React + Vite application
- **Development**: `http://localhost:3000`
- **Production**: Firebase Hosting

### Firebase Configuration

```json
// firebase.json
{
  "hosting": {
    "public": "apps/web/dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"]
  }
}
```

## 6. DEVELOPMENT WORKFLOW

### Local Development
1. **Start API server**: `pnpm --filter @fitness-tracker/api dev`
2. **Start web app**: `pnpm --filter @fitness-tracker/web dev`
3. **Run tests**: `pnpm test`
4. **Build**: `pnpm build`

### Code Quality
- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier
- **Type checking**: TypeScript strict mode
- **Pre-commit hooks**: Husky + lint-staged

## 7. SECURITY

### Authentication
- **Firebase Authentication**: Email/password, Google OAuth
- **JWT tokens**: Automatic token refresh
- **Protected routes**: Client-side route protection

### Data Security
- **Firestore security rules**: User-based access control
- **Input validation**: Zod schemas on all endpoints
- **CORS**: Configured for development and production

## 8. PERFORMANCE

### Frontend
- **Vite**: Fast development and optimized builds
- **React Query**: Intelligent caching and background updates
- **Code splitting**: Automatic route-based splitting

### Backend
- **Express**: Lightweight and fast
- **tRPC**: Type-safe and efficient API calls
- **Firebase**: Scalable backend services

## 9. TESTING STRATEGY

### Current Implementation
- **Unit tests**: Vitest + Testing Library
- **Component tests**: Storybook
- **API tests**: Manual testing via debug page

### Planned
- **E2E tests**: Playwright
- **Integration tests**: API endpoint testing
- **Performance tests**: Lighthouse CI

## 10. MONITORING & ANALYTICS

### Current
- **Error tracking**: Console logging
- **Performance**: Vite build analytics

### Planned
- **Application monitoring**: Firebase Performance
- **Error tracking**: Sentry integration
- **Analytics**: Firebase Analytics

## 11. FUTURE ROADMAP

### Phase 2: Enhanced Features
- **Real-time updates**: WebSocket integration
- **Offline support**: Service workers
- **Mobile app**: React Native

### Phase 3: Advanced Features
- **AI recommendations**: Machine learning integration
- **Social features**: User connections and sharing
- **Wearable integration**: Health device APIs

---

*Last updated: 2025-01-21 - Updated to reflect current implementation with Express + tRPC backend*
