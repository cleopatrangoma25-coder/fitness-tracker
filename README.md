# Fitness Tracker Pro

A modern, full-stack fitness tracking application that helps users track workouts, manage profiles, and achieve fitness goals. Built with a robust TypeScript monorepo architecture, type-safe tRPC API, and Firebase services.

## 🏗️ Architecture

- **Frontend**: React + Vite + shadcn/ui + Tailwind CSS
- **Backend**: Express + tRPC API + Firebase (Authentication, Firestore, Hosting)
- **State Management**: Zustand + TanStack Query (via tRPC)
- **Component Architecture**: Stack-based organization with centralized exports
- **Monorepo**: PNPM workspaces + Turborepo
- **Deployment**: Firebase Hosting
- **CI/CD**: GitHub Actions

## 📦 Project Structure

```
fitness-tracker/
├── apps/
│   ├── web/                 # React + Vite web application
│   │   └── src/
│   │       ├── components/
│   │       │   ├── auth/          # Authentication components
│   │       │   ├── dashboard/     # Dashboard components
│   │       │   ├── goals/         # Goal management components
│   │       │   ├── layout/        # Layout and navigation components
│   │       │   ├── notifications/ # Notification components
│   │       │   ├── onboarding/    # Onboarding components
│   │       │   ├── profile/       # Profile management components
│   │       │   ├── stacks/        # Stack-based component exports (centralized)
│   │       │   └── workout/       # Workout management components
│   │       ├── pages/             # Page components
│   │       ├── hooks/             # Custom React hooks
│   │       ├── lib/               # Service libraries
│   │       └── contexts/          # React contexts
│   └── api/                 # Express + tRPC API server
├── packages/
│   ├── shared/             # Shared utilities, schemas, and types
│   ├── store/              # Zustand state management
│   └── ui/                 # Reusable UI components
├── scripts/                # Build and deployment automation
│   ├── deploy-staging.js   # Staging deployment script
│   ├── setup-env.js        # Environment setup
│   └── verify-auth.js      # Authentication verification
├── docs/                   # Technical documentation
└── .github/                # CI/CD workflows
```

## 🏗️ Component Architecture

The application uses a **stack-based component architecture** that provides excellent separation of concerns and maintainability:

- **Domain-Based Organization**: Components organized by feature (auth, workout, goals, etc.)
- **Stack-Based Exports**: Centralized component exports through `stacks/__index.ts`
- **Consistent Imports**: All pages import from the stack index for maintainability
- **Type Safety**: Full TypeScript support with proper interfaces

### Import Pattern
```typescript
// ✅ Stack-based imports (recommended)
import { SignInForm, WorkoutLog, Navigation } from '../components/stacks/__index';

// ❌ Direct imports (avoid)
import { SignInForm } from '../components/auth/SignInForm';
```

For detailed information, see [Component Architecture Guide](docs/COMPONENT_ARCHITECTURE.md).

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v22.x or higher
- **PNPM**: v10.13.1 (recommended)
- **Firebase CLI**: `npm install -g firebase-tools`

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd fitness-tracker
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up Firebase projects**
   ```bash
   # Login to Firebase
   firebase login
   
   # Use development project
   firebase use development
   ```

4. **Set up environment variables**
   ```bash
   pnpm setup:env
   ```

5. **Configure Firebase**
   - Copy your Firebase configuration to `apps/web/.env.local`
   - Update the placeholder values with your actual Firebase project settings

6. **Start development environment**
   ```bash
   # Start all services in development mode
   pnpm dev
   
   # Or start individual services
   pnpm --filter @fitness-tracker/api dev    # tRPC API server (port 3001)
   pnpm --filter @fitness-tracker/web dev    # React web app (port 3000)
   ```

7. **Start Firebase emulators** (optional)
   ```bash
   firebase emulators:start
   ```

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm dev                 # Start all packages in watch mode
pnpm build              # Build all packages
pnpm test               # Run tests across all packages
pnpm lint               # Lint all packages
pnpm typecheck          # Type check all packages

# Individual packages
pnpm --filter @fitness-tracker/web dev    # Start web app
pnpm --filter @fitness-tracker/api dev    # Start API server
pnpm --filter @fitness-tracker/shared build  # Build shared package
```

### API Development

The project includes a type-safe tRPC API server:

- **API Server**: Express + tRPC running on port 3001
- **Endpoints**: User management, workout tracking, goal setting
- **Authentication**: Firebase Auth integration
- **Database**: Firebase Firestore

Visit `http://localhost:3000/debug` to see the tRPC example component.

## 📊 Current Status

### ✅ Completed Milestones

1. **Project Foundation** - Monorepo setup, tooling, CI/CD
2. **Authentication & Profiles** - Complete auth flow with Firebase
3. **Workout Logging** - Full workout tracking functionality
4. **Progress Analytics** - Dashboard with charts and statistics
5. **tRPC API Integration** - Type-safe API layer
6. **Goal Setting & Management** - Comprehensive goal tracking with validation and analytics
7. **Code Organization & Cleanup** - Stack-based component architecture with centralized exports

### 🚀 Next Milestone

8. **Beta Release** - Polish, testing, and launch preparation

## 🔧 Technology Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Hook Form + Zod** - Form handling and validation
- **React Router** - Client-side routing

### Backend
- **Express** - Web server
- **tRPC** - Type-safe API layer
- **Firebase Auth** - Authentication
- **Firebase Firestore** - Database
- **Firebase Admin** - Server-side Firebase SDK

### Development Tools
- **PNPM** - Package manager
- **Turborepo** - Build orchestration
- **ESLint + Prettier** - Code quality
- **Husky** - Git hooks
- **Vitest** - Testing
- **Storybook** - Component development

## 📚 Documentation

- [Technical Design Document](docs/technical-design-doc.md) - Architecture and design decisions
- [Component Architecture](docs/COMPONENT_ARCHITECTURE.md) - Stack-based component organization
- [TODO & Milestones](docs/TODO.md) - Development roadmap
- [Implementation Summary](docs/IMPLEMENTATION_SUMMARY.md) - Feature implementation details
- [tRPC Setup Guide](docs/TRPC_SETUP.md) - API development guide
- [Firebase Setup](FIREBASE_SETUP.md) - Firebase configuration
- [Deployment Guide](DEPLOYMENT.md) - Deployment instructions

## 🚀 Deployment

### Development
```bash
# Start local development
pnpm dev
```

### Staging
```bash
# Deploy to staging
pnpm deploy:staging
```

### Production
```bash
# Deploy to production
pnpm deploy:prod
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using modern web technologies**