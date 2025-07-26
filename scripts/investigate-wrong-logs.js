// INVESTIGATION SCRIPT - Run this in the browser console on the health page
// Copy and paste this entire script into your browser console

console.log('🔍 INVESTIGATING WRONG LOGS ISSUE');
console.log('=' .repeat(60));

// Step 1: Check current user
console.log('👤 Current User Info:');
console.log('User ID:', window.user?.userId || 'No user found');
console.log('User Email:', window.user?.email || 'No email found');

// Step 2: Check local storage
console.log('\n📦 Local Storage Analysis:');
const healthStore = localStorage.getItem('health-store');
if (healthStore) {
  const parsed = JSON.parse(healthStore);
  console.log('Health store exists:', !!parsed);
  console.log('Health logs in store:', parsed?.state?.healthLogs?.length || 0);
  
  if (parsed?.state?.healthLogs) {
    console.log('\n📋 Local Health Logs:');
    parsed.state.healthLogs.forEach((log, index) => {
      console.log(`  ${index + 1}. ID: ${log.id} | Type: ${log.type} | Date: ${log.date} | UserId: ${log.userId}`);
    });
  }
} else {
  console.log('No health store found in localStorage');
}

// Step 3: Check session storage
console.log('\n💾 Session Storage Analysis:');
const sessionKeys = Object.keys(sessionStorage);
console.log('Session storage keys:', sessionKeys);

// Step 4: Check Zustand store state
console.log('\n🏪 Zustand Store Analysis:');
if (window.__ZUSTAND_STORES__) {
  console.log('Zustand stores found:', Object.keys(window.__ZUSTAND_STORES__));
  Object.keys(window.__ZUSTAND_STORES__).forEach(key => {
    if (key.includes('health')) {
      console.log(`Health store state:`, window.__ZUSTAND_STORES__[key]);
    }
  });
} else {
  console.log('No Zustand stores found');
}

// Step 5: Check for any global variables
console.log('\n🌐 Global Variables Check:');
const globalVars = Object.keys(window).filter(key => 
  key.includes('health') || key.includes('log') || key.includes('data')
);
console.log('Health-related global variables:', globalVars);

// Step 6: Check if there are any cached network requests
console.log('\n🌐 Network Cache Check:');
if ('caches' in window) {
  caches.keys().then(cacheNames => {
    console.log('Available caches:', cacheNames);
    cacheNames.forEach(cacheName => {
      if (cacheName.includes('health') || cacheName.includes('firebase')) {
        console.log(`Checking cache: ${cacheName}`);
        caches.open(cacheName).then(cache => {
          cache.keys().then(requests => {
            console.log(`Cache ${cacheName} has ${requests.length} entries`);
          });
        });
      }
    });
  });
}

// Step 7: Check for any service workers
console.log('\n👷 Service Worker Check:');
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    console.log('Service worker registrations:', registrations.length);
    registrations.forEach(reg => {
      console.log('Service worker:', reg.scope);
    });
  });
}

// Step 8: Check for any indexedDB data
console.log('\n🗄️ IndexedDB Check:');
if ('indexedDB' in window) {
  const request = indexedDB.open('firebaseLocalStorage');
  request.onsuccess = function(event) {
    const db = event.target.result;
    console.log('IndexedDB opened successfully');
    if (db.objectStoreNames.contains('firebaseLocalStorage')) {
      const transaction = db.transaction(['firebaseLocalStorage'], 'readonly');
      const store = transaction.objectStore('firebaseLocalStorage');
      const getAllRequest = store.getAll();
      getAllRequest.onsuccess = function() {
        console.log('IndexedDB entries:', getAllRequest.result.length);
        getAllRequest.result.forEach(entry => {
          if (entry.key.includes('health')) {
            console.log('Health-related IndexedDB entry:', entry);
          }
        });
      };
    }
  };
}

console.log('\n=' .repeat(60));
console.log('✅ Investigation complete!');
console.log('\n📋 NEXT STEPS:');
console.log('1. Look for logs with wrong userId');
console.log('2. Check if logs are coming from cache');
console.log('3. Verify if logs are from previous sessions');
console.log('4. Check if there are any test/debug logs'); 