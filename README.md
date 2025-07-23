# Fitness Tracker

A modern, full-stack fitness tracking application that helps users track workouts, manage profiles, and achieve fitness goals. Built with a robust TypeScript monorepo architecture and Firebase services.

## 🏗️ Architecture

- **Frontend**: React + Vite + shadcn/ui + Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Hosting)
- **State Management**: Zustand
- **Monorepo**: PNPM workspaces + Turborepo
- **Deployment**: Firebase Hosting
- **CI/CD**: GitHub Actions (planned)

## 📦 Project Structure

```
fitness-tracker/
├── apps/
│   └── web/                 # React + Vite web application
├── packages/
│   ├── shared/             # Shared utilities, schemas, and types
│   ├── store/              # Zustand state management
│   └── ui/                 # Reusable UI components
├── scripts/                # Build and deployment automation
│   ├── deploy-staging.js   # Staging deployment script
│   ├── setup-env.js        # Environment setup
│   └── verify-auth.js      # Authentication verification
├── docs/                   # Technical documentation
└── .github/                # CI/CD workflows (planned)
```

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v22.x or higher
- **PNPM**: v10.13.1 (recommended)
- **Firebase CLI**: `npm install -g firebase-tools`

### Key Dependencies

- **fs-extra**: File system operations for deployment script
- **Turborepo**: Build orchestration and caching
- **TypeScript**: Strict type checking across monorepo
- **Firebase**: Authentication, database, and hosting
- **Vite**: Fast build tool and development server
- **React**: UI library with modern hooks and components

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
   pnpm --filter @fitness-tracker/web dev
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
pnpm clean              # Clean all build artifacts

# Deployment
pnpm deploy:staging     # Build and deploy to staging
pnpm build:staging      # Build for staging environment

# Quality checks
pnpm lint               # Run ESLint across all packages
pnpm typecheck         # Run TypeScript checks
pnpm test              # Run tests (when implemented)

# Formatting
pnpm format            # Format code with Prettier
pnpm format:check      # Check code formatting
```

### Package-specific Scripts

```bash
# Web app
pnpm --filter @fitness-tracker/web dev
pnpm --filter @fitness-tracker/web build
pnpm --filter @fitness-tracker/web preview

# Shared package
pnpm --filter @fitness-tracker/shared build

# Store package
pnpm --filter @fitness-tracker/store build

# UI package
pnpm --filter @fitness-tracker/ui build
```

## 🎨 Brand Colors

Fitness Tracker uses a modern, health-focused color palette:

- **Primary (Blue)**: #3B82F6 - Representing trust and reliability
- **Secondary (Green)**: #10B981 - Representing health and growth
- **Accent (Orange)**: #F59E0B - Representing energy and motivation

## 🔧 Configuration

### Environment Variables

Create environment files for different stages:

```bash
# .env.local (for local development)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=fitness-tracker-dev-4499e.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=fitness-tracker-dev-4499e
VITE_FIREBASE_STORAGE_BUCKET=fitness-tracker-dev-4499e.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Firebase Projects

- **Development**: `fitness-tracker-dev-4499e` - For testing and development
- **Production**: `fitness-tracker-11c7a` - For live application

## 📱 User Features

### Authentication
- User registration and login with email/password
- Password reset functionality
- Protected routes and session management
- User profile management

### Dashboard
- Fitness statistics overview
- Recent workout activity
- Quick action buttons
- Progress tracking and goals

### Profile Management
- Personal information management
- Fitness preferences and goals
- Profile picture upload
- Account settings and preferences

### Workout Tracking
- Log workout sessions
- Track exercise types, sets, reps, and weights
- Workout history and analytics
- Progress visualization

## 🧪 Testing Strategy

### Test Coverage (Planned)
- **Unit Tests**: Vitest for pure functions and utilities
- **Component Tests**: Testing Library for React components
- **Visual Tests**: Storybook for UI component development
- **E2E Tests**: Playwright for critical user flows

### Test Commands (When Implemented)
```bash
# Run all tests
pnpm test

# Run with coverage report
pnpm --filter @fitness-tracker/web run test:coverage

# Watch mode for development
pnpm --filter @fitness-tracker/web run test:watch
```

## 🚢 Deployment

### Staging Deployment

```bash
# Deploy to staging environment
pnpm deploy:staging
```

This command:
1. ✅ Verifies Firebase configuration
2. ✅ Builds all packages
3. ✅ Deploys to Firebase Hosting
4. ✅ Makes your app available at: https://fitness-tracker-dev-4499e.web.app

### Production Deployment

```bash
# Switch to production Firebase project
firebase use production

# Deploy everything
firebase deploy --only hosting
```

### Deployment Architecture

```
Source Code (monorepo)           Deployment Package
├── apps/web/                    ├── apps/web/dist/
│   ├── src/                     │   ├── assets/          # ✅ Vite build
│   ├── public/                  │   ├── index.html       # ✅ Entry point
│   └── package.json             │   └── vite.svg         # ✅ Static assets
├── packages/shared/             └── firebase.json
├── packages/store/                  └── "public": "apps/web/dist"
└── packages/ui/
```

## ✅ Milestone 1: Project Foundation - COMPLETED

**December 2024**: Successfully completed Milestone 1 with the following achievements:

- ✅ **Full Monorepo Setup**: PNPM workspaces with Turborepo orchestration
- ✅ **Deployment Pipeline**: Custom scripts for Firebase Hosting deployment
- ✅ **Authentication System**: Complete user signup, login, and profile management
- ✅ **Type Safety**: End-to-end TypeScript with Zod validation
- ✅ **Modern UI**: React + Vite + Tailwind CSS component library
- ✅ **Firebase Integration**: Auth, Firestore, and Hosting
- ✅ **Code Quality**: ESLint, Prettier, proper error logging, and development best practices

**Ready for Milestone 2**: Core workout tracking and dashboard features.

## 🤝 Contributing

1. **Create a feature branch**: `git checkout -b feature/amazing-feature`
2. **Make your changes and commit**: `git commit -m 'Add amazing feature'`
3. **Push to the branch**: `git push origin feature/amazing-feature`
4. **Open a Pull Request**

### Code Quality

- ESLint configuration enforces TypeScript best practices
- Prettier ensures consistent code formatting
- Husky pre-commit hooks run linting and formatting
- All code must pass TypeScript strict mode

## 📚 Documentation

- [Technical Design Document](docs/technical-design-doc.md)
- [Project Roadmap](docs/TODO.md)
- [Firebase Setup Guide](FIREBASE_SETUP.md)
- [Deployment Guide](DEPLOYMENT.md)

## 🛡️ Security

- Firebase Authentication for user management
- Firestore security rules for data protection
- All user inputs validated with Zod schemas
- Protected routes and role-based access control

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🛠️ Troubleshooting

### Deployment Issues

**Problem**: `firebase deploy` fails with "Cannot find module"
**Solution**: Use our custom deployment commands that handle monorepo dependencies:
```bash
pnpm deploy:staging  # Full deployment with proper build order
```

**Problem**: Environment variables not loading
**Solution**: Ensure `.env.local` exists and has correct `VITE_` prefixes:
```bash
pnpm setup:env  # Creates template
# Then manually update with your Firebase config
```

**Problem**: Authentication not working in staging
**Solution**: Check Firebase Console for:
- API key restrictions
- Authorized domains
- Authentication providers enabled

### Development Issues

**Problem**: Hot reload not working
**Solution**: Make sure you're running from project root:
```bash
pnpm dev  # From project root, not apps/web/
```

**Problem**: PNPM workspace not resolving dependencies
**Solution**: Ensure dependencies are installed and you're using PNPM:
```bash
pnpm install
pnpm --filter @fitness-tracker/web dev
```

### Debug Commands

```bash
# Check if environment variables are loaded
pnpm verify:auth

# Check Firebase configuration
firebase projects:list

# Verify build output
ls -la apps/web/dist/

# Check package dependencies
pnpm list --depth=0
```

## 🆘 Support

If you encounter any issues:

1. Check the [Firebase Setup Guide](FIREBASE_SETUP.md)
2. Review the [Deployment Guide](DEPLOYMENT.md)
3. Check the [TODO List](docs/TODO.md) for known issues
4. Open an issue in the repository

## 🎯 Roadmap

### Milestone 2: Core Workout Features (In Progress)
- [ ] Workout creation and editing
- [ ] Exercise library and management
- [ ] Progress tracking and analytics
- [ ] Goal setting and achievement

### Milestone 3: Advanced Features (Planned)
- [ ] Social features (friends, sharing)
- [ ] Advanced analytics and insights
- [ ] Workout templates and plans
- [ ] Nutrition tracking integration
- [ ] Mobile app (React Native)

### Milestone 4: Platform Enhancement (Future)
- [ ] AI-powered workout recommendations
- [ ] Integration with fitness devices
- [ ] Community features and challenges
- [ ] Premium subscription features

---

**Build with love by Cleopatra**