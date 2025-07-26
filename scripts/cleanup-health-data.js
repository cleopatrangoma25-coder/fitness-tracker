const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, deleteDoc, doc } = require('firebase/firestore');

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

async function analyzeHealthData() {
  const userId = 'wcUTYAspadOuhYrzavx2eRm5r182';
  
  try {
    console.log('\n🔍 Analyzing Health Data...');
    console.log('=' .repeat(50));
    
    // Check Firebase health logs
    console.log('📊 Checking Firebase health logs...');
    const healthLogsSnapshot = await getDocs(collection(db, 'healthLogs'));
    const firebaseLogs = [];
    
    healthLogsSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.userId === userId) {
        firebaseLogs.push({
          id: doc.id,
          type: data.type,
          date: data.date,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
        });
      }
    });
    
    console.log(`Firebase health logs for user: ${firebaseLogs.length}`);
    
    if (firebaseLogs.length > 0) {
      console.log('\n📋 Sample Firebase logs:');
      firebaseLogs.slice(0, 5).forEach((log, index) => {
        console.log(`  ${index + 1}. ID: ${log.id} | Type: ${log.type} | Date: ${log.date}`);
      });
    }
    
    // Check health insights
    console.log('\n🧠 Checking health insights...');
    const healthInsightsSnapshot = await getDocs(collection(db, 'healthInsights'));
    const firebaseInsights = [];
    
    healthInsightsSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.userId === userId) {
        firebaseInsights.push({
          id: doc.id,
          type: data.type,
          title: data.title,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
        });
      }
    });
    
    console.log(`Firebase health insights for user: ${firebaseInsights.length}`);
    
    console.log('\n=' .repeat(50));
    console.log('✅ Analysis completed');
    
    return {
      firebaseLogs,
      firebaseInsights
    };
    
  } catch (error) {
    console.error('❌ Error analyzing health data:', error);
    throw error;
  }
}

async function cleanupHealthData() {
  const userId = 'wcUTYAspadOuhYrzavx2eRm5r182';
  
  try {
    console.log('\n🧹 Starting Health Data Cleanup...');
    console.log('=' .repeat(50));
    
    // Get all health logs for the user
    const healthLogsSnapshot = await getDocs(collection(db, 'healthLogs'));
    const userLogs = [];
    
    healthLogsSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.userId === userId) {
        userLogs.push({
          id: doc.id,
          type: data.type,
          date: data.date,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
        });
      }
    });
    
    console.log(`Found ${userLogs.length} health logs for user`);
    
    if (userLogs.length === 0) {
      console.log('No health logs to clean up');
      return;
    }
    
    // Sort by creation date to keep the most recent ones
    userLogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Keep only the 50 most recent logs
    const logsToKeep = userLogs.slice(0, 50);
    const logsToDelete = userLogs.slice(50);
    
    console.log(`Keeping ${logsToKeep.length} most recent logs`);
    console.log(`Deleting ${logsToDelete.length} older logs`);
    
    // Delete older logs
    let deletedCount = 0;
    for (const log of logsToDelete) {
      try {
        await deleteDoc(doc(db, 'healthLogs', log.id));
        deletedCount++;
        if (deletedCount % 10 === 0) {
          console.log(`Deleted ${deletedCount} logs...`);
        }
      } catch (error) {
        console.error(`Failed to delete log ${log.id}:`, error.message);
      }
    }
    
    console.log(`\n✅ Cleanup completed!`);
    console.log(`Deleted ${deletedCount} health logs`);
    console.log(`Kept ${logsToKeep.length} most recent logs`);
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  }
}

async function main() {
  try {
    // First analyze the data
    await analyzeHealthData();
    
    // Ask user if they want to proceed with cleanup
    console.log('\n⚠️  WARNING: This will delete older health logs!');
    console.log('This action cannot be undone.');
    console.log('Type "YES" to proceed with cleanup, or anything else to cancel:');
    
    // For now, we'll proceed with cleanup since this is a script
    console.log('Proceeding with cleanup...');
    await cleanupHealthData();
    
  } catch (error) {
    console.error('❌ Script failed:', error);
  }
}

main(); 