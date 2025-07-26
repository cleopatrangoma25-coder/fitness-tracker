const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where } = require('firebase/firestore');

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

async function debugHealthData() {
  const userId = 'wcUTYAspadOuhYrzavx2eRm5r182';
  
  try {
    console.log('\n🔍 DEBUGGING HEALTH DATA ISSUE');
    console.log('=' .repeat(60));
    console.log('User ID:', userId);
    
    // Get ALL health logs (without user filter first)
    console.log('\n📊 Getting ALL health logs from Firebase...');
    const allLogsSnapshot = await getDocs(collection(db, 'healthLogs'));
    const allLogs = [];
    
    allLogsSnapshot.forEach((doc) => {
      const data = doc.data();
      allLogs.push({
        id: doc.id,
        userId: data.userId,
        type: data.type,
        date: data.date,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
      });
    });
    
    console.log(`Total health logs in Firebase: ${allLogs.length}`);
    
    // Group by user
    const logsByUser = {};
    allLogs.forEach(log => {
      if (!logsByUser[log.userId]) {
        logsByUser[log.userId] = [];
      }
      logsByUser[log.userId].push(log);
    });
    
    console.log('\n👥 Health logs by user:');
    Object.keys(logsByUser).forEach(userId => {
      console.log(`  User ${userId}: ${logsByUser[userId].length} logs`);
      if (logsByUser[userId].length > 0) {
        console.log(`    Sample logs:`);
        logsByUser[userId].slice(0, 3).forEach(log => {
          console.log(`      - ${log.type} on ${log.date} (created: ${log.createdAt})`);
        });
      }
    });
    
    // Check for logs with missing userId
    const logsWithoutUserId = allLogs.filter(log => !log.userId);
    if (logsWithoutUserId.length > 0) {
      console.log('\n⚠️  WARNING: Found logs without userId!');
      console.log(`Logs without userId: ${logsWithoutUserId.length}`);
      logsWithoutUserId.slice(0, 5).forEach(log => {
        console.log(`  - ID: ${log.id}, Type: ${log.type}, Date: ${log.date}`);
      });
    }
    
    // Check for logs with wrong userId format
    const logsWithWrongUserId = allLogs.filter(log => log.userId && log.userId !== userId && log.userId.length < 20);
    if (logsWithWrongUserId.length > 0) {
      console.log('\n⚠️  WARNING: Found logs with suspicious userId!');
      console.log(`Logs with suspicious userId: ${logsWithWrongUserId.length}`);
      logsWithWrongUserId.slice(0, 5).forEach(log => {
        console.log(`  - ID: ${log.id}, UserId: ${log.userId}, Type: ${log.type}`);
      });
    }
    
    // Get user's specific logs
    console.log('\n🔍 Getting logs for specific user...');
    const userLogsQuery = query(collection(db, 'healthLogs'), where('userId', '==', userId));
    const userLogsSnapshot = await getDocs(userLogsQuery);
    const userLogs = [];
    
    userLogsSnapshot.forEach((doc) => {
      const data = doc.data();
      userLogs.push({
        id: doc.id,
        userId: data.userId,
        type: data.type,
        date: data.date,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
      });
    });
    
    console.log(`Logs for user ${userId}: ${userLogs.length}`);
    
    if (userLogs.length > 0) {
      console.log('\n📋 User logs:');
      userLogs.slice(0, 10).forEach((log, index) => {
        console.log(`  ${index + 1}. ${log.type} on ${log.date} (ID: ${log.id})`);
      });
    }
    
    console.log('\n=' .repeat(60));
    console.log('✅ Debug completed');
    
    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    if (logsWithoutUserId.length > 0) {
      console.log('1. Clean up logs without userId');
    }
    if (logsWithWrongUserId.length > 0) {
      console.log('2. Investigate logs with suspicious userId');
    }
    if (userLogs.length > 50) {
      console.log('3. Consider limiting the number of logs loaded');
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
    throw error;
  }
}

debugHealthData(); 