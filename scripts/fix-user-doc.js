// Browser Console Script to Fix Missing User Document
// Run this in the browser console on the staging site

console.log('🔧 Fixing missing user document...');

// Get the current user
const currentUser = firebase.auth().currentUser;

if (!currentUser) {
  console.error('❌ No authenticated user found. Please sign in first.');
} else {
  console.log(`👤 Current user: ${currentUser.email} (${currentUser.uid})`);
  
  // Check if user document exists
  firebase.firestore().collection('users').doc(currentUser.uid).get()
    .then((doc) => {
      if (doc.exists) {
        console.log('✅ User document already exists');
        console.log('📄 User data:', doc.data());
      } else {
        console.log('❌ User document does not exist. Creating...');
        
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
        
        return firebase.firestore().collection('users').doc(currentUser.uid).set(userData);
      }
    })
    .then(() => {
      console.log('✅ User document created successfully!');
      console.log('🔄 Please refresh the page to test Firestore access.');
    })
    .catch((error) => {
      console.error('❌ Error:', error);
    });
} 