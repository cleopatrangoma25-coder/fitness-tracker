#!/usr/bin/env node

const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc, getDoc } = require('firebase/firestore');

// Firebase configuration for staging
const firebaseConfig = {
  apiKey: 'AIzaSyBv-emUyOcZlOSed2QI0NesI4CPNO05CPY',
  authDomain: 'fitness-tracker-dev-4499e.firebaseapp.com',
  projectId: 'fitness-tracker-dev-4499e',
  storageBucket: 'fitness-tracker-dev-4499e.firebasestorage.app',
  messagingSenderId: '547911348305',
  appId: '1:547911348305:web:8e8b59ee17f8e03e6bc870'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createUserDocument() {
  try {
    console.log('🔧 Creating missing user document...');
    
    // Get current user
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error('❌ No authenticated user found. Please sign in first.');
      return;
    }

    console.log(`👤 Current user: ${currentUser.email} (${currentUser.uid})`);

    // Check if user document already exists
    const userDocRef = doc(db, 'users', currentUser.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      console.log('✅ User document already exists');
      console.log('📄 User data:', userDoc.data());
      return;
    }

    // Create user document
    const userData = {
      email: currentUser.email,
      displayName: currentUser.displayName || 'User',
      firstName: currentUser.displayName?.split(' ')[0] || 'User',
      lastName: currentUser.displayName?.split(' ').slice(1).join(' ') || '',
      role: 'USER',
      preferences: {
        units: 'METRIC',
        notifications: true,
        privacy: 'PRIVATE',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(userDocRef, userData);
    console.log('✅ User document created successfully!');
    console.log('📄 User data:', userData);

  } catch (error) {
    console.error('❌ Error creating user document:', error);
  }
}

// Run the function
createUserDocument().then(() => {
  console.log('🎉 Script completed');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
}); 