export function clearCache() {
  // Clear React Query cache
  if (window.__REACT_QUERY_DEVTOOLS__) {
    window.__REACT_QUERY_DEVTOOLS__.clearCache();
  }

  // Clear localStorage
  localStorage.clear();

  // Clear sessionStorage
  sessionStorage.clear();

  // Clear all caches using Cache API
  if ('caches' in window) {
    caches.keys().then(keys => {
      keys.forEach(key => caches.delete(key));
    });
  }

  // Clear IndexedDB databases
  if ('indexedDB' in window) {
    indexedDB.databases().then(dbs => {
      dbs.forEach(db => {
        indexedDB.deleteDatabase(db.name);
      });
    });
  }

  console.log('Cache cleared successfully');
}