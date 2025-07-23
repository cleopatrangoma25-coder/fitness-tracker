# Fitness Tracker Technical Design Doc

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

## 2. TECH STACK (GOLDEN PATH)

The proposed tech stack is perfectly suited for a modern, real-time, and type-safe application like Fitness Tracker Pro. We will adopt it as specified.

- **Runtime**: Node.js (v22 via Firebase Cloud Functions)
- **Language**: TypeScript (strict)
- **Front‑end**: React + Vite
- **UI kit**: shadcn/ui
- **Styling**: Tailwind CSS
- **State / data fetching**: TanStack Query
- **Forms & validation**: React Hook Form + Zod resolver
- **Shared validation**: Zod (client & server)
- **API layer**: tRPC
- **Backend services**: Firebase Auth · Firestore · Storage · Functions
- **Package manager / mono**: PNPM workspaces
- **Build orchestration**: Turborepo
- **Component workshop**: Storybook
- **Unit / component tests**: Vitest + Testing Library
- **End‑to‑end tests**: Playwright
- **Linting**: ESLint + eslint-plugin-perfectionist
- **Formatting**: Prettier
- **Type‑safe env vars**: T3 Env
- **Versioning / publishing**: Changesets
- **CI / CD**: GitHub Actions

## 3. MONOREPO LAYOUT (PNPM)

The proposed monorepo structure provides excellent separation of concerns and code sharing.

```
.
├── apps/
│   └── web/              ← React front-end (Dashboard, Logging, Goals)
├── functions/            ← Cloud Functions / tRPC routers
├── packages/
│   ├── shared/           ← Zod schemas, utilities, common types (e.g., WorkoutType)
│   └── seeding/          ← Data-seeding helpers (for Firestore emulator)
├── docs/                 ← Project docs (this TDD, ADRs, etc.)
└── .github/              ← CI workflows
```

## 4. ARCHITECTURE

The architecture is a classic serverless model leveraging the Firebase ecosystem, ensuring scalability and type safety from client to database.

- **Client (React + TanStack Query)** ⇄ **tRPC HTTPS endpoints (Cloud Functions)**
- **tRPC handlers** ⇄ **Firebase Services (Firestore, Auth)**

## 5. DEPLOYMENT ARCHITECTURE

### Monorepo Deployment Challenge & Solution

**Problem**: Firebase Cloud Functions deployment via `firebase deploy` does not natively support PNPM workspace protocols ("workspace:*"), causing build failures.

**Solution**: A custom deployment script that creates a standalone, deployable package for the functions.

```javascript
// scripts/prepare-deploy.js - Key steps:
1. Copy `functions` source code to a temporary `functions-deploy/` directory.
2. Copy the `shared` package source into `functions-deploy/shared/`.
3. In `functions-deploy/package.json`, replace `"workspace:*"` with `"file:./shared"`.
4. Run `pnpm install` within the `functions-deploy` directory.
5. Build the `shared` package first, then build the `functions` package.
```

### Firebase Configuration

```json
// firebase.json
{
  "functions": {
    "source": "functions-deploy", // Points to our prepared deployment directory
    "runtime": "nodejs22"
  },
  "hosting": {
    "public": "apps/web/dist", // Points to the built Vite/React application
    "rewrites": [{
      "source": "/api/**",
      "function": "api" // Rewrites /api requests to our main tRPC cloud function
    }]
  }
}
```

## 6. DATA MODEL (FIRESTORE)

| Entity | Key fields | Notes |
|--------|------------|-------|
| User | uid, email, displayName, photoURL, role (user/admin), height, weight, unitPreference | |
| Workout | userId, date (Timestamp), type ('Cardio', 'Strength', 'Other'), durationMinutes, caloriesBurned, notes | Core entity for a single workout session. |
| ExerciseLog | workoutId, userId, exerciseName, sets (array of {reps, weight}), distanceKm, resistanceLevel | Sub-collection under Workout or top-level. Logs individual exercises within a workout. |
| Goal | userId, type ('weight', 'distance', 'frequency'), targetValue, currentValue, startDate, deadline | Tracks user-defined fitness goals. |

### Security rules:
- Users can only read/write their own User, Workout, ExerciseLog, and Goal documents.
- Admin role has read-only access to user data for support purposes.
- Validation rules will enforce data integrity (e.g., durationMinutes must be a positive number).

### Index strategy:
- Composite index on workouts collection: (userId, date desc) for the user's workout history.
- Composite index on goals collection: (userId, status) for the user's dashboard.

## 7. API DESIGN (tRPC)

| Router | Procedure | Input (Zod schema) | Output |
|--------|-----------|-------------------|---------|
| user | getProfile | z.void() | User |
| | updateProfile | updateUserSchema | User |
| workout | create | createWorkoutSchema | Workout |
| | getById | z.object({ id: z.string() }) | Workout & ExerciseLog[] |
| | list | z.object({ limit: z.number().optional() }) | Workout[] |
| | delete | z.object({ id: z.string() }) | { success: boolean } |
| goal | create | createGoalSchema | Goal |
| | listActive | z.void() | Goal[] |
| | updateProgress | z.object({ id: z.string(), value: z.number() }) | Goal |

### Error-handling conventions:
- **UNAUTHORIZED**: User not logged in.
- **BAD_REQUEST**: Input validation fails.
- **NOT_FOUND**: The requested document (e.g., workout ID) does not exist.
- **INTERNAL_SERVER_ERROR**: For all unhandled exceptions.

## 8. TESTING STRATEGY

| Level / focus | Toolset | Scope |
|---------------|---------|-------|
| Unit | Vitest | Zod schemas, utility functions like calculateBmi or formatDate. |
| Component | Vitest + Testing Library | React components in isolation (e.g., WorkoutForm, GoalProgressCircle). |
| Visual | Storybook | UI snapshots for visual regression, user interactions. |
| End‑to‑end | Playwright | Critical user flows: sign up, log a new strength workout, create a new goal. |

**Coverage target**: Achieve 80%+ statement coverage on the shared and functions packages before launch.

**Fixtures / seeding**: A `pnpm seed` command will populate the Firebase emulator with test users and workout data for consistent E2E testing.

## 9. CI / CD PIPELINE (GITHUB ACTIONS)

- **Trigger**: On push to any branch or on Pull Request to main.
- Setup PNPM and restore Turbo remote cache.
- `pnpm exec turbo run lint typecheck`
- `pnpm exec turbo run test`
- `pnpm exec turbo run build`
- **On PR**: Deploy preview to a Firebase Hosting channel.
- **On Merge to main**: Deploy frontend to Firebase Hosting and backend to Cloud Functions.

## 10. ENVIRONMENTS & SECRETS

| Env | URL / target | Notes |
|-----|--------------|-------|
| local | localhost:5173 | .env.local + Firebase emulators; validated by T3 Env. |
| preview-* | fitnesstracker--pr<number>-<hash>.web.app | Auto-created per PR via Firebase Hosting channels. |
| prod | app.fitnesstracker.pro | Promote via CI workflow on merge to main. |

Secrets (FIREBASE_SERVICE_ACCOUNT, etc.) will be stored in GitHub repository secrets and loaded into the CI environment.

## 11. PERFORMANCE & SCALABILITY

- **Firestore**: Use pagination for all workout history lists.
- **TanStack Query**: Aggressively cache user profiles and historical workout data.
- **Frontend**: Code-split route components using Vite's dynamic imports (e.g., separate chunk for detailed analytics pages).
- **Cloud Functions**: Set appropriate memory configurations and a minimum instance count for the main API function to reduce cold starts.

## 12. MONITORING & LOGGING

| Concern | Tool | Notes |
|---------|------|-------|
| Runtime errors | Sentry | Front‑end and back-end error capture with source maps. |
| Server logs | Google Cloud Logging | All Cloud Function logs are automatically ingested. |
| Analytics | PostHog | Track user funnels (signup → first_workout → goal_created), feature usage. |

## 13. ACCESSIBILITY & I18N

**Accessibility**: Adherence to WCAG 2.1 AA standards. The use of shadcn/ui provides a strong, accessible foundation. Keyboard navigation and screen reader support will be tested.

**i18n plan**: The MVP will be English-only. The codebase will use a library like react-i18next, with all strings externalized into JSON files to allow for future language additions.

## 14. CODE QUALITY & FORMATTING

- Prettier will be configured to format code on save.
- ESLint will enforce code style and best practices.
- A Husky pre-commit hook will run lint-staged to ensure code quality before commits.

## 15. OPEN QUESTIONS / RISKS

| Item | Owner | Resolution date |
|------|-------|-----------------|
| Finalize a consistent and accurate formula for "calories burned". | Tech Lead | 2025-08-15 |
| Research data privacy implications (e.g., GDPR) for storing health data. | Tech Lead | 2025-09-01 |
| Plan for future integration with wearables (Apple Health, Google Fit). | Product Owner | 2025-10-01 |

## 16. APPENDICES

**Branching model**: GitHub Flow. Create branches off main for features/bugs.

**Links**:
- Figma Designs: [Link to Figma Project]
- Storybook: [Link to Deployed Storybook]

**Last updated**: July 23, 2025