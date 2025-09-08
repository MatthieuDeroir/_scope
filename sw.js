/**
 * Service Worker for Tech Articles Blog
 * Provides offline functionality and caching for improved performance
 */

const CACHE_NAME = 'tech-blog-v1.0.0';
const RUNTIME_CACHE = 'runtime-cache-v1';

// Core files to cache on install
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/assets/css/style.css',
  '/assets/js/main.js',
  '/manifest.json'
];

// Cache strategies for different types of requests
const CACHE_STRATEGIES = {
  // Cache first for static assets
  CACHE_FIRST: 'cache-first',
  // Network first for API calls and dynamic content
  NETWORK_FIRST: 'network-first',
  // Stale while revalidate for images and frequently updated content
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

// Install event - cache core assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching core assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        // Force the waiting service worker to become the active service worker
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Cache installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all pages
      self.clients.claim()
    ])
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external requests (different origin)
  if (url.origin !== location.origin) {
    return;
  }
  
  // Determine caching strategy based on request type
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirst(request));
  } else if (isHTMLRequest(request)) {
    event.respondWith(networkFirst(request));
  } else if (isImageRequest(request)) {
    event.respondWith(staleWhileRevalidate(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});

// Message event - handle messages from the client
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * Cache First Strategy
 * Try cache first, fall back to network
 */
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Cache First strategy failed:', error);
    return new Response('Network error', { status: 408 });
  }
}

/**
 * Network First Strategy
 * Try network first, fall back to cache
 */
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful network responses
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    // If network fails, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If both fail and it's an HTML request, serve offline page
    if (isHTMLRequest(request)) {
      return caches.match('/offline.html');
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Network First strategy failed:', error);
    
    // Try cache when network fails
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Serve offline page for HTML requests
    if (isHTMLRequest(request)) {
      return caches.match('/offline.html');
    }
    
    return new Response('Network error', { status: 408 });
  }
}

/**
 * Stale While Revalidate Strategy
 * Serve from cache while updating cache in background
 */
async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request)
    .then(networkResponse => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(error => {
      console.error('Stale While Revalidate fetch failed:', error);
      return cachedResponse; // Return cached version if network fails
    });
  
  // Return cached version immediately if available, otherwise wait for network
  return cachedResponse || fetchPromise;
}

/**
 * Utility Functions
 */

function isStaticAsset(request) {
  return request.url.includes('/assets/') || 
         request.url.includes('.css') || 
         request.url.includes('.js') ||
         request.url.includes('manifest.json');
}

function isHTMLRequest(request) {
  return request.headers.get('Accept').includes('text/html');
}

function isImageRequest(request) {
  return request.headers.get('Accept').includes('image/') ||
         request.url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
}

function isAPIRequest(request) {
  return request.url.includes('/api/') || 
         request.url.includes('.json');
}

/**
 * Background Sync (for future use)
 */
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Placeholder for background sync functionality
  // Could be used for sending analytics data, form submissions, etc.
  console.log('Background sync triggered');
}

/**
 * Push Notifications (for future use)
 */
self.addEventListener('push', event => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/assets/icons/icon-192.png',
      badge: '/assets/icons/badge-72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2'
      },
      actions: [
        {
          action: 'explore',
          title: 'Read Article',
          icon: '/assets/icons/checkmark.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/assets/icons/xmark.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification('New Article Available!', options)
    );
  }
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'explore') {
    // Open the article
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the site
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

/**
 * Cache Management
 */

// Periodic cleanup of old cache entries
setInterval(() => {
  cleanupOldCacheEntries();
}, 24 * 60 * 60 * 1000); // Run daily

async function cleanupOldCacheEntries() {
  try {
    const cache = await caches.open(RUNTIME_CACHE);
    const requests = await cache.keys();
    const now = Date.now();
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    
    for (const request of requests) {
      const response = await cache.match(request);
      const dateHeader = response.headers.get('date');
      
      if (dateHeader) {
        const responseDate = new Date(dateHeader).getTime();
        if (now - responseDate > maxAge) {
          await cache.delete(request);
          console.log('Deleted old cache entry:', request.url);
        }
      }
    }
  } catch (error) {
    console.error('Cache cleanup failed:', error);
  }
}

console.log('Service Worker: Loaded');