// Browser Console Script to Test Workout Query
// Run this in the browser console on the staging site

console.log('🔧 Testing workout query...');

// Get the current user
const currentUser = firebase.auth().currentUser;

if (!currentUser) {
  console.error('❌ No authenticated user found. Please sign in first.');
} else {
  console.log(`👤 Current user: ${currentUser.email} (${currentUser.uid})`);
  
  // Test 1: Simple query without orderBy
  console.log('📊 Test 1: Simple query without orderBy...');
  firebase.firestore().collection('workouts')
    .where('userId', '==', currentUser.uid)
    .get()
    .then((snapshot) => {
      console.log(`✅ Found ${snapshot.size} workouts (simple query)`);
      snapshot.forEach((doc) => {
        console.log('📄 Workout:', doc.id, doc.data());
      });
    })
    .catch((error) => {
      console.error('❌ Simple query error:', error);
    });
  
  // Test 2: Query with orderBy
  console.log('📊 Test 2: Query with orderBy...');
  firebase.firestore().collection('workouts')
    .where('userId', '==', currentUser.uid)
    .orderBy('date', 'desc')
    .get()
    .then((snapshot) => {
      console.log(`✅ Found ${snapshot.size} workouts (with orderBy)`);
      snapshot.forEach((doc) => {
        console.log('📄 Workout:', doc.id, doc.data());
      });
    })
    .catch((error) => {
      console.error('❌ OrderBy query error:', error);
      console.log('💡 This might be due to missing index or date field issues');
    });
  
  // Test 3: Check if workouts collection exists
  console.log('📊 Test 3: Check workouts collection...');
  firebase.firestore().collection('workouts').limit(1).get()
    .then((snapshot) => {
      console.log(`✅ Workouts collection exists with ${snapshot.size} documents`);
    })
    .catch((error) => {
      console.error('❌ Workouts collection error:', error);
    });
} 