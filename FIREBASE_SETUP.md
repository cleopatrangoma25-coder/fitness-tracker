# Firebase Setup & Deployment Guide

## 🚀 Quick Start: Deploy to Staging

### Step 1: Get Firebase Configuration

1. **Open Firebase Console**
   - Go to: https://console.firebase.google.com/
   - Sign in with your Google account

2. **Select Your Project**
   - Click on: `fitness-tracker-dev-4499e` (staging environment)

3. **Get Web App Configuration**
   - Click the gear icon ⚙️ (Project Settings)
   - Scroll down to "Your apps" section
   - Click on your web app (or create one if it doesn't exist)
   - Copy the configuration object

### Step 2: Update Environment Variables

1. **Open the .env.local file**
   ```bash
   code apps/web/.env.local
   ```

2. **Replace the placeholder values** with your actual Firebase config:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...your_actual_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=fitness-tracker-dev-4499e.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=fitness-tracker-dev-4499e
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=fitness-tracker-dev-4499e.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=1:your_actual_app_id
   ```

### Step 3: Deploy to Staging

```bash
pnpm deploy:staging
```

## 📋 What You'll See

### Firebase Console Configuration Example:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "fitness-tracker-dev-4499e.firebaseapp.com",
  projectId: "fitness-tracker-dev-4499e",
  storageBucket: "fitness-tracker-dev-4499e.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### Expected Deployment Output:
```
🚀 Deploying to staging...
📦 Building packages...
🌐 Deploying to Firebase development environment...
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/fitness-tracker-dev-4499e/overview
Hosting URL: https://fitness-tracker-dev-4499e.web.app
```

## 🔧 Troubleshooting

### If you get "auth/invalid-api-key":
- Double-check your API key in `.env.local`
- Make sure you copied the entire key (it's usually 39 characters)

### If you get "Project not found":
- Verify you're using the correct project ID: `fitness-tracker-dev-4499e`
- Make sure you have access to the Firebase project

### If build fails:
- Check that all environment variables are set
- Make sure there are no extra spaces or quotes in `.env.local`

## 🎯 What's Being Deployed

- ✅ User Authentication (Sign Up, Sign In, Password Reset)
- ✅ User Profile Management
- ✅ Protected Routes
- ✅ Responsive UI with Tailwind CSS
- ✅ Firebase Integration
- ✅ TypeScript & ESLint Configuration

## 🌐 After Deployment

Your app will be available at: **https://fitness-tracker-dev-4499e.web.app**

Test these features:
1. User registration
2. User login
3. Profile management
4. Protected routes

## 📞 Need Help?

If you encounter issues:
1. Check the Firebase Console for errors
2. Verify your environment variables
3. Make sure you're logged into Firebase CLI: `firebase login` 