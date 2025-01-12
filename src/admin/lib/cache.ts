// lib/cache.ts

interface Cache {
    data?: any;
    timestamp?: number;
  }
  
  let cache: Cache = {};
  const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  export const getCache = () => {
    const currentTime = Date.now();
    // Check if cache is valid
    if (cache.timestamp && (currentTime - cache.timestamp < CACHE_EXPIRATION)) {
      return cache.data; // Return cached response
    }
    return null; // Cache is expired or not set
  };
  
  export const setCache = (data: any) => {
    cache.data = {...data, cache: true};
    cache.timestamp = Date.now(); // Update cache timestamp
  };
  
  export const resetCache = () => {
    cache = {}; // Clear the cache
  };