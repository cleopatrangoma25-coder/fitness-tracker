const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, deleteDoc, doc, query, where } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvQvQvQvQvQvQvQvQvQvQvQvQvQvQvQvQ",
  authDomain: "fitness-tracker-dev-4499e.firebaseapp.com",
  projectId: "fitness-tracker-dev-4499e",
  storageBucket: "fitness-tracker-dev-4499e.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function forceCleanup() {
  const userId = 'wcUTYAspadOuhYrzavx2eRm5r182';
  
  try {
    console.log('\n🧹 FORCE CLEANUP - Removing ALL health data...');
    console.log('=' .repeat(60));
    
    // Delete all health logs for the user
    console.log('🗑️  Deleting health logs...');
    const healthLogsQuery = query(collection(db, 'healthLogs'), where('userId', '==', userId));
    const healthLogsSnapshot = await getDocs(healthLogsQuery);
    
    let deletedLogs = 0;
    for (const docSnapshot of healthLogsSnapshot.docs) {
      try {
        await deleteDoc(docSnapshot.ref);
        deletedLogs++;
        if (deletedLogs % 50 === 0) {
          console.log(`Deleted ${deletedLogs} health logs...`);
        }
      } catch (error) {
        console.error(`Failed to delete health log ${docSnapshot.id}:`, error.message);
      }
    }
    
    // Delete all health insights for the user
    console.log('\n🧠 Deleting health insights...');
    const healthInsightsQuery = query(collection(db, 'healthInsights'), where('userId', '==', userId));
    const healthInsightsSnapshot = await getDocs(healthInsightsQuery);
    
    let deletedInsights = 0;
    for (const docSnapshot of healthInsightsSnapshot.docs) {
      try {
        await deleteDoc(docSnapshot.ref);
        deletedInsights++;
      } catch (error) {
        console.error(`Failed to delete health insight ${docSnapshot.id}:`, error.message);
      }
    }
    
    console.log('\n=' .repeat(60));
    console.log('✅ FORCE CLEANUP COMPLETED!');
    console.log(`🗑️  Deleted ${deletedLogs} health logs`);
    console.log(`🧠 Deleted ${deletedInsights} health insights`);
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Go to https://fitness-tracker-dev-4499e.web.app/health');
    console.log('2. Open browser developer tools (F12)');
    console.log('3. Go to Console tab');
    console.log('4. Run: localStorage.clear()');
    console.log('5. Reload the page');
    console.log('\n🎯 Your health dashboard will be completely clean!');
    
  } catch (error) {
    console.error('❌ Force cleanup failed:', error);
    throw error;
  }
}

forceCleanup(); 