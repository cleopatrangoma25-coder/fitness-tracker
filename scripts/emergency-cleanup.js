// EMERGENCY CLEANUP SCRIPT
// Copy and paste this entire script into your browser console on the health page

console.log('🚨 EMERGENCY HEALTH DATA CLEANUP');
console.log('=' .repeat(50));

// Step 1: Clear all local storage
console.log('🗑️  Clearing local storage...');
localStorage.clear();
sessionStorage.clear();

// Step 2: Clear any Zustand store data
console.log('🧹 Clearing Zustand store...');
if (window.__ZUSTAND_STORES__) {
  Object.keys(window.__ZUSTAND_STORES__).forEach(key => {
    if (key.includes('health')) {
      delete window.__ZUSTAND_STORES__[key];
    }
  });
}

// Step 3: Clear any React state
console.log('⚛️  Clearing React state...');
if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
  // Clear any cached component state
  const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (hook.renderers && hook.renderers.size > 0) {
    hook.renderers.forEach(renderer => {
      if (renderer.getFiberRoots) {
        const roots = renderer.getFiberRoots();
        roots.forEach(root => {
          if (root.current && root.current.memoizedState) {
            root.current.memoizedState = null;
          }
        });
      }
    });
  }
}

// Step 4: Force reload the page
console.log('🔄 Reloading page...');
console.log('✅ Cleanup completed! The page will reload in 3 seconds...');

setTimeout(() => {
  window.location.reload();
}, 3000);

console.log('=' .repeat(50));
console.log('📋 After reload:');
console.log('1. Your health dashboard should be completely clean');
console.log('2. No more "Health log not found" errors');
console.log('3. You can start fresh with health tracking');
console.log('4. All CRUD operations should work properly'); 