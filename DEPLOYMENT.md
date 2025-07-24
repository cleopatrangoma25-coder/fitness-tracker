# Deployment Guide

This guide will help you deploy the Fitness Tracker application to staging.

## Prerequisites

1. **Firebase CLI**: Install Firebase CLI if not already installed
   ```bash
   npm install -g firebase-tools
   ```

2. **Firebase Account**: Make sure you're logged into Firebase
   ```bash
   firebase login
   ```

## Step 1: Set up Environment Variables

### Option A: Automatic Setup
```bash
pnpm setup:env
```

### Option B: Manual Setup
1. Copy the environment template:
   ```bash
   cp apps/web/env.example apps/web/.env.local
   ```

2. Edit `apps/web/.env.local` with your Firebase configuration

## Step 2: Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (fitness-tracker-dev-4499e)
3. Go to Project Settings (gear icon)
4. Scroll down to "Your apps" section
5. Click on the web app or create a new one
6. Copy the configuration values

### Example Configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=fitness-tracker-dev-4499e.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=fitness-tracker-dev-4499e
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=fitness-tracker-dev-4499e.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## Step 3: Deploy to Staging

```bash
pnpm deploy:staging
```

This command will:
1. ✅ Check environment variables are configured
2. ✅ Build all packages
3. ✅ Switch to development Firebase project
4. ✅ Deploy to Firebase Hosting

## Step 4: Verify Deployment

After successful deployment, you'll see a URL like:
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/fitness-tracker-dev-4499e/overview
Hosting URL: https://fitness-tracker-dev-4499e.web.app
```

## Troubleshooting

### Build Errors
- **Firebase API Key Error**: Make sure your `.env.local` file has the correct Firebase configuration
- **Environment Variables Not Found**: Run `pnpm setup:env` to create the template

### Deployment Errors
- **Authentication Error**: Run `firebase login --reauth`
- **Project Not Found**: Check your `.firebaserc` file and Firebase project settings

### Common Issues

1. **"auth/invalid-api-key"**: 
   - Check your Firebase API key in `.env.local`
   - Make sure the project ID matches your Firebase project

2. **"Project not found"**:
   - Verify you have access to the Firebase project
   - Check the project ID in `.firebaserc`

3. **Build fails during static generation**:
   - This is expected without Firebase credentials
   - The app will work correctly in the browser with proper credentials

## Environment Configuration

### Development (Staging)
- **Project**: fitness-tracker-dev-4499e
- **URL**: https://fitness-tracker-dev-4499e.web.app
- **Database**: Firestore (development)

### Production
- **Project**: fitness-tracker-11c7a
- **URL**: https://fitness-tracker-11c7a.web.app
- **Database**: Firestore (production)

## Next Steps

After deployment:
1. Test the authentication flow
2. Verify user registration and login
3. Test profile management
4. Check protected routes

## Support

If you encounter issues:
1. Check the Firebase Console for errors
2. Verify environment variables are correct
3. Check Firebase project settings
4. Review the deployment logs 