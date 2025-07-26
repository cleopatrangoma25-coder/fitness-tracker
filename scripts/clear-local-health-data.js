// This script provides instructions for clearing local health data
// Run this in the browser console on the health page

console.log('🧹 Health Data Cleanup Instructions');
console.log('=' .repeat(50));

console.log(`
To clear the problematic local health data:

1. Go to the health page: https://fitness-tracker-dev-4499e.web.app/health

2. Open browser developer tools (F12)

3. Go to the Console tab

4. Run these commands one by one:

   // Clear all health data from local storage
   localStorage.removeItem('health-store');
   
   // Clear any other health-related data
   localStorage.removeItem('health-data');
   localStorage.removeItem('health-logs');
   
   // Reload the page
   window.location.reload();

5. After reload, the health page should be clean

6. If you want to keep some recent data, you can selectively clear:
   
   // Get current health data
   const healthData = JSON.parse(localStorage.getItem('health-store') || '{}');
   
   // Keep only the 10 most recent logs
   if (healthData.state && healthData.state.healthLogs) {
     const recentLogs = healthData.state.healthLogs
       .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
       .slice(0, 10);
     
     healthData.state.healthLogs = recentLogs;
     healthData.state.recentLogs = recentLogs;
     
     localStorage.setItem('health-store', JSON.stringify(healthData));
   }
`);

console.log('=' .repeat(50));
console.log('✅ Instructions ready!'); 